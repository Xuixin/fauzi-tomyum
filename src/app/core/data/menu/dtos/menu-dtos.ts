export interface MenuResponseDTO {
    id: string;
    type: string;
    sub_type?: string;
    name: string;
    image_url?: string;
    is_active: boolean;

    variants: MenuVariantDTO[];

    options?: MenuOptionDTO[];
}

export interface MenuVariantDTO {
    id: string;
    display_name: string;
    name: string;        // ไก่ / กุ้ง
    price: number;
    sku?: string;
    image_url?: string;
    kitchen_id: string;
    is_default: boolean;
    is_active: boolean;
}

export interface MenuOptionDTO {
    id: string;
    name: string;        // ระดับความหวาน
    required: boolean;
    multiple: boolean;

    items: MenuOptionItemDTO[];
}

export interface MenuOptionItemDTO {
    id: string;
    name: string;        // ไข่ดาว / ไข่เจียว
    price: number;
}

// req
export interface GetMenusQueryDTO {
    type?: string;
    sub_type?: string;
    is_active?: boolean;
}

export interface CreateMenuRequestDTO {
    type: string;
    sub_type?: string;
    name: string;
    image_url?: string;
    is_active?: boolean; // default true

    variants: CreateMenuVariantDTO[];

    options?: CreateMenuOptionDTO[];
}

export interface CreateMenuVariantDTO {
    name: string;          // ไก่ / กุ้ง
    display_name: string;
    price: number;
    sku?: string;
    image_url?: string;
    kitchen_id: string;
    is_default?: boolean;  // default false
    is_active?: boolean;   // default true
}

export interface CreateMenuOptionDTO {
    name: string;          // ระดับความหวาน
    required: boolean;
    multiple: boolean;

    items: CreateMenuOptionItemDTO[];
}

export interface CreateMenuOptionItemDTO {
    name: string;          // ไข่ดาว / ไข่เจียว
    price: number;
}

