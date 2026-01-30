import { Injectable } from "@angular/core";
import { CreateMenuRequestDTO, GetMenusQueryDTO, MenuResponseDTO } from "./../dtos/menu-dtos";
import { MenuAdapterService } from "./menu-adapter.service";

/**
 * Facade service for menu operations
 * Provides a simplified interface and adds business logic
 */
@Injectable({
    providedIn: 'root'
})
export class MenuFacadeService {
    constructor(private menuAdapter: MenuAdapterService) { }

    /**
     * Get all active menus
     */
    getActiveMenus(): Promise<MenuResponseDTO[]> {
        return this.menuAdapter.getMenus({ is_active: true });
    }

    /**
     * Get menus by type (e.g., 'food', 'drink')
     */
    getMenusByType(type: string): Promise<MenuResponseDTO[]> {
        return this.menuAdapter.getMenus({ type, is_active: true });
    }

    /**
     * Get menus by type and subtype
     */
    getMenusByTypeAndSubType(type: string, subType: string): Promise<MenuResponseDTO[]> {
        return this.menuAdapter.getMenus({ type, sub_type: subType, is_active: true });
    }

    /**
     * Get all menus with optional filtering
     */
    getMenus(query?: GetMenusQueryDTO): Promise<MenuResponseDTO[]> {
        return this.menuAdapter.getMenus(query);
    }

    /**
     * Get a single menu by ID
     */
    getMenuById(id: string): Promise<MenuResponseDTO> {
        return this.menuAdapter.getMenuById(id);
    }

    /**
     * Create a new menu
     */
    async createMenu(menu: CreateMenuRequestDTO): Promise<MenuResponseDTO> {
        // Add business logic validation here if needed
        this.validateMenuData(menu);

        const created = await this.menuAdapter.createMenu(menu);
        console.log('Menu created:', created);
        return created;
    }

    /**
     * Update an existing menu
     */
    async updateMenu(id: string, menu: Partial<CreateMenuRequestDTO>): Promise<MenuResponseDTO> {
        const updated = await this.menuAdapter.updateMenu(id, menu);
        console.log('Menu updated:', updated);
        return updated;
    }

    /**
     * Delete a menu (soft delete by setting is_active to false)
     */
    softDeleteMenu(id: string): Promise<MenuResponseDTO> {
        return this.menuAdapter.updateMenu(id, { is_active: false });
    }

    /**
     * Hard delete a menu
     */
    async deleteMenu(id: string): Promise<void> {
        await this.menuAdapter.deleteMenu(id);
        console.log('Menu deleted:', id);
    }

    /**
     * Get menu price range for a specific menu
     */
    async getMenuPriceRange(menuId: string): Promise<{ min: number; max: number }> {
        const menu = await this.getMenuById(menuId);
        const prices = menu.variants.map(v => v.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    /**
     * Validate menu data before creation
     */
    private validateMenuData(menu: CreateMenuRequestDTO): void {
        if (!menu.name || menu.name.trim().length === 0) {
            throw new Error('Menu name is required');
        }

        if (!menu.variants || menu.variants.length === 0) {
            throw new Error('At least one variant is required');
        }

        const hasDefault = menu.variants.some(v => v.is_default);
        if (!hasDefault) {
            // Auto-set first variant as default if none specified
            menu.variants[0].is_default = true;
        }
    }
}
