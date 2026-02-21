export interface StationData {
    id: number, name: string, city: string, lat: number, lng: number
}

export type MapDetails = Array<StationData>

export type Center = [number,number]