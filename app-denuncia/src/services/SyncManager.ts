import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import denunciaService from './denunciaService';
import type { CreateDenunciaDTO } from '../types/denuncia';

const OFFLINE_QUEUE_KEY = '@MPAC_OFFLINE_REPORTS';

interface OfflineReport {
    id: string;
    data: CreateDenunciaDTO;
    media: string[]; // Local paths
    timestamp: number;
}

class SyncManager {
    private isSyncing: boolean = false;

    constructor() {
        this.setupConnectivityListener();
    }

    private setupConnectivityListener(): void {
        NetInfo.addEventListener(state => {
            if (state.isConnected && state.isInternetReachable) {
                this.trySync();
            }
        });
    }

    async enqueueReport(reportData: CreateDenunciaDTO, mediaUris: string[]): Promise<boolean> {
        try {
            // 1. Save media to local filesystem
            const savedMediaPaths = await Promise.all(mediaUris.map(async (uri) => {
                const filename = uri.split('/').pop();
                const newPath = `${(FileSystem as any).documentDirectory}offline_media_${Date.now()}_${filename}`;
                await FileSystem.copyAsync({ from: uri, to: newPath });
                return newPath;
            }));

            // 2. Prepare report object
            const offlineReport: OfflineReport = {
                id: `offline_${Date.now()}`,
                data: reportData,
                media: savedMediaPaths,
                timestamp: Date.now()
            };

            // 3. Add to AsyncStorage queue
            const existingQueue = await this.getQueue();
            const newQueue = [...existingQueue, offlineReport];
            await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(newQueue));

            return true;
        } catch (error) {
            console.error('[SyncManager] Error enqueuing report:', error);
            return false;
        }
    }

    async getQueue(): Promise<OfflineReport[]> {
        const queueStr = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        return queueStr ? JSON.parse(queueStr) : [];
    }

    async trySync(): Promise<void> {
        if (this.isSyncing) return;

        const queue = await this.getQueue();
        if (queue.length === 0) return;

        console.log(`[SyncManager] Starting sync of ${queue.length} reports...`);
        this.isSyncing = true;

        const remainingQueue: OfflineReport[] = [];

        for (const report of queue) {
            try {
                const success = await this.uploadReport(report);
                if (!success) {
                    remainingQueue.push(report);
                } else {
                    // Clean up local files
                    await Promise.all(report.media.map(path =>
                        FileSystem.deleteAsync(path, { idempotent: true })
                    ));
                }
            } catch (error) {
                console.error(`[SyncManager] Sync failed for report: ${report.id}`, error);
                remainingQueue.push(report);
            }
        }

        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));
        this.isSyncing = false;
        console.log(`[SyncManager] Sync finished. ${remainingQueue.length} items remaining.`);
    }

    private async uploadReport(report: OfflineReport): Promise<boolean> {
        const { data, media } = report;

        // Convert local paths back to "file" objects for FormData
        const mediaFiles = media.map((uri) => {
            const filename = uri.split('/').pop() || 'file';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;
            return { uri, name: filename, type } as any;
        });

        try {
            await denunciaService.createDenuncia({
                ...data,
                media: mediaFiles
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default new SyncManager();
