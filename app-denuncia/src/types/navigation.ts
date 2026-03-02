import type { Denuncia } from './denuncia';

export type RootStackParamList = {
    Splash: undefined;
    MainTabs: undefined;
};

export type MainTabParamList = {
    InicioStack: undefined;
    DenunciasStack: undefined;
    MapaStack: undefined;
};

export type InicioStackParamList = {
    Inicio: undefined;
    DenunciaDetalhes: { denuncia: Denuncia };
};

export type DenunciasStackParamList = {
    DenunciasTab: undefined;
    NovaDenuncia: undefined;
    MinhasDenuncias: undefined;
    DenunciaDetalhes: { denuncia: Denuncia };
};

export type MapaStackParamList = {
    Mapa: undefined;
    DenunciaDetalhes: { denuncia: Denuncia };
};
