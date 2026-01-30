import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { CreateMenuRequestDTO, GetMenusQueryDTO, MenuResponseDTO } from "./../dtos/menu-dtos";
import { MenuAdapterService } from "../service/menu-adapter.service";

/**
 * API-based implementation of MenuAdapterService
 * Makes HTTP calls to backend API endpoints
 */
@Injectable()
export class ApiMenuAdapterService extends MenuAdapterService {
    private readonly API_URL = '/api/menus'; // Update with your actual API base URL

    constructor(private http: HttpClient) {
        super();
    }

    getMenus(query?: GetMenusQueryDTO): Promise<MenuResponseDTO[]> {
        let params = new HttpParams();

        if (query) {
            if (query.type) params = params.set('type', query.type);
            if (query.sub_type) params = params.set('sub_type', query.sub_type);
            if (query.is_active !== undefined) params = params.set('is_active', query.is_active.toString());
        }

        return firstValueFrom(this.http.get<MenuResponseDTO[]>(this.API_URL, { params }));
    }

    getMenuById(id: string): Promise<MenuResponseDTO> {
        return firstValueFrom(this.http.get<MenuResponseDTO>(`${this.API_URL}/${id}`));
    }

    createMenu(menu: CreateMenuRequestDTO): Promise<MenuResponseDTO> {
        return firstValueFrom(this.http.post<MenuResponseDTO>(this.API_URL, menu));
    }

    updateMenu(id: string, menu: Partial<CreateMenuRequestDTO>): Promise<MenuResponseDTO> {
        return firstValueFrom(this.http.patch<MenuResponseDTO>(`${this.API_URL}/${id}`, menu));
    }

    deleteMenu(id: string): Promise<void> {
        return firstValueFrom(this.http.delete<void>(`${this.API_URL}/${id}`));
    }
}
