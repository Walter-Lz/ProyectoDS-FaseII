// Definición de tipos para la navegación
export type RootStackParamList = {
  Home: undefined;
  DetailsProduct:{ idProduct: string }; // Details Screen espera un parámetro
};