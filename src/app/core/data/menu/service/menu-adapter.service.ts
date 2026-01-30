import { CreateMenuRequestDTO, GetMenusQueryDTO, MenuResponseDTO } from "./../dtos/menu-dtos";

/**
 * Abstract adapter service for menu data operations
 * Implementations can be API-based or Mock-based
 */
export abstract class MenuAdapterService {
    /**
     * Get all menus with optional filtering
     */
    abstract getMenus(query?: GetMenusQueryDTO): Promise<MenuResponseDTO[]>;

    /**
     * Get a single menu by ID
     */
    abstract getMenuById(id: string): Promise<MenuResponseDTO>;

    /**
     * Create a new menu
     */
    abstract createMenu(menu: CreateMenuRequestDTO): Promise<MenuResponseDTO>;

    /**
     * Update an existing menu
     */
    abstract updateMenu(id: string, menu: Partial<CreateMenuRequestDTO>): Promise<MenuResponseDTO>;

    /**
     * Delete a menu by ID
     */
    abstract deleteMenu(id: string): Promise<void>;
}
