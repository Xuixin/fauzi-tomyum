import { Injectable } from "@angular/core";

import { CreateMenuRequestDTO, GetMenusQueryDTO, MenuResponseDTO } from "./../dtos/menu-dtos";
import { MenuAdapterService } from "../service/menu-adapter.service";

/**
 * Mock implementation of MenuAdapterService
 * Uses in-memory data for development and testing
 */
@Injectable()
export class MockMenuAdapterService extends MenuAdapterService {
  private menus: MenuResponseDTO[] = [
    {
      id: '1',
      type: 'food',
      sub_type: 'rice',
      image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      name: 'ข้าวผัดกะเพรา',
      is_active: true,
      variants: [
        {
          id: 'v1',
          name: 'ไก่',
          display_name: 'ข้าวผัดกะเพราไก่',
          price: 45,
          sku: 'KPG-001',
          image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          kitchen_id: 'k1',
          is_default: true,
          is_active: true
        },
        {
          id: 'v2',
          name: 'หมู',
          display_name: 'ข้าวผัดกะเพราหมู',
          price: 45,
          sku: 'KPG-002',
          kitchen_id: 'k1',
          is_default: false,
          is_active: true
        },
        {
          id: 'v3',
          name: 'กุ้ง',
          display_name: 'ข้าวผัดกะเพรากุ้ง',
          price: 60,
          sku: 'KPG-003',
          kitchen_id: 'k1',
          is_default: false,
          is_active: true
        }
      ],
      options: [
        {
          id: 'o1',
          name: 'ไข่',
          required: false,
          multiple: false,
          items: [
            { id: 'oi1', name: 'ไข่ดาว', price: 10 },
            { id: 'oi2', name: 'ไข่เจียว', price: 10 }
          ]
        },
        {
          id: 'o2',
          name: 'ระดับความเผ็ด',
          required: true,
          multiple: false,
          items: [
            { id: 'oi3', name: 'ไม่เผ็ด', price: 0 },
            { id: 'oi4', name: 'เผ็ดน้อย', price: 0 },
            { id: 'oi5', name: 'เผ็ดปานกลาง', price: 0 },
            { id: 'oi6', name: 'เผ็ดมาก', price: 0 }
          ]
        }
      ]
    },
    {
      id: '2',
      type: 'drink',
      sub_type: 'coffee',
      name: 'กาแฟเย็น',
      image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      is_active: true,
      variants: [
        {
          id: 'v4',
          name: 'Regular',
          display_name: 'กาแฟเย็น',
          price: 35,
          sku: 'COFFEE-001',
          image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          kitchen_id: 'k2',
          is_default: true,
          is_active: true
        }
      ],
      options: [
        {
          id: 'o3',
          name: 'ระดับความหวาน',
          required: true,
          multiple: false,
          items: [
            { id: 'oi7', name: 'ไม่หวาน', price: 0 },
            { id: 'oi8', name: 'หวานน้อย', price: 0 },
            { id: 'oi9', name: 'หวานปานกลาง', price: 0 },
            { id: 'oi10', name: 'หวานมาก', price: 0 }
          ]
        }
      ]
    },
    {
      id: '2',
      type: 'drink',
      sub_type: 'coffee',
      name: 'กาแฟเย็น',
      image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      is_active: true,
      variants: [
        {
          id: 'v4',
          name: 'Regular',
          display_name: 'กาแฟเย็น',
          price: 35,
          sku: 'COFFEE-001',
          image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          kitchen_id: 'k2',
          is_default: true,
          is_active: true
        }
      ],
      options: [
        {
          id: 'o3',
          name: 'ระดับความหวาน',
          required: true,
          multiple: false,
          items: [
            { id: 'oi7', name: 'ไม่หวาน', price: 0 },
            { id: 'oi8', name: 'หวานน้อย', price: 0 },
            { id: 'oi9', name: 'หวานปานกลาง', price: 0 },
            { id: 'oi10', name: 'หวานมาก', price: 0 }
          ]
        }
      ]
    },
    {
      id: '2',
      type: 'drink',
      sub_type: 'coffee',
      name: 'กาแฟเย็น',
      image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      is_active: true,
      variants: [
        {
          id: 'v4',
          name: 'Regular',
          display_name: 'กาแฟเย็น',
          price: 35,
          sku: 'COFFEE-001',
          image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          kitchen_id: 'k2',
          is_default: true,
          is_active: true
        }
      ],
      options: [
        {
          id: 'o3',
          name: 'ระดับความหวาน',
          required: true,
          multiple: false,
          items: [
            { id: 'oi7', name: 'ไม่หวาน', price: 0 },
            { id: 'oi8', name: 'หวานน้อย', price: 0 },
            { id: 'oi9', name: 'หวานปานกลาง', price: 0 },
            { id: 'oi10', name: 'หวานมาก', price: 0 }
          ]
        }
      ]
    },
    {
      id: '2',
      type: 'drink',
      sub_type: 'coffee',
      name: 'กาแฟเย็น',
      image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      is_active: true,
      variants: [
        {
          id: 'v4',
          name: 'Regular',
          display_name: 'กาแฟเย็น',
          price: 35,
          sku: 'COFFEE-001',
          image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          kitchen_id: 'k2',
          is_default: true,
          is_active: true
        }
      ],
      options: [
        {
          id: 'o3',
          name: 'ระดับความหวาน',
          required: true,
          multiple: false,
          items: [
            { id: 'oi7', name: 'ไม่หวาน', price: 0 },
            { id: 'oi8', name: 'หวานน้อย', price: 0 },
            { id: 'oi9', name: 'หวานปานกลาง', price: 0 },
            { id: 'oi10', name: 'หวานมาก', price: 0 }
          ]
        }
      ]
    },
    {
      id: '2',
      type: 'drink',
      sub_type: 'coffee',
      name: 'กาแฟเย็น',
      image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      is_active: true,
      variants: [
        {
          id: 'v4',
          name: 'Regular',
          display_name: 'กาแฟเย็น',
          price: 35,
          sku: 'COFFEE-001',
          image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          kitchen_id: 'k2',
          is_default: true,
          is_active: true
        }
      ],
      options: [
        {
          id: 'o3',
          name: 'ระดับความหวาน',
          required: true,
          multiple: false,
          items: [
            { id: 'oi7', name: 'ไม่หวาน', price: 0 },
            { id: 'oi8', name: 'หวานน้อย', price: 0 },
            { id: 'oi9', name: 'หวานปานกลาง', price: 0 },
            { id: 'oi10', name: 'หวานมาก', price: 0 }
          ]
        }
      ]
    },
  ];

  private nextId = 3;

  async getMenus(query?: GetMenusQueryDTO): Promise<MenuResponseDTO[]> {
    let filtered = [...this.menus];

    if (query) {
      if (query.type) {
        filtered = filtered.filter(m => m.type === query.type);
      }
      if (query.sub_type) {
        filtered = filtered.filter(m => m.sub_type === query.sub_type);
      }
      if (query.is_active !== undefined) {
        filtered = filtered.filter(m => m.is_active === query.is_active);
      }
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return filtered;
  }

  async getMenuById(id: string): Promise<MenuResponseDTO> {
    const menu = this.menus.find(m => m.id === id);

    await new Promise(resolve => setTimeout(resolve, 200));

    if (!menu) {
      throw new Error(`Menu with id ${id} not found`);
    }

    return menu;
  }

  async createMenu(menuDto: CreateMenuRequestDTO): Promise<MenuResponseDTO> {
    const newMenu: MenuResponseDTO = {
      id: (this.nextId++).toString(),
      type: menuDto.type,
      sub_type: menuDto.sub_type,
      name: menuDto.name,
      is_active: menuDto.is_active ?? true,
      variants: menuDto.variants.map((v, idx) => ({
        id: `v${this.nextId * 10 + idx}`,
        name: v.name,
        display_name: v.display_name,
        price: v.price,
        sku: v.sku,
        kitchen_id: v.kitchen_id,
        is_default: v.is_default ?? false,
        is_active: v.is_active ?? true
      })),
      options: menuDto.options?.map((o, idx) => ({
        id: `o${this.nextId * 10 + idx}`,
        name: o.name,
        required: o.required,
        multiple: o.multiple,
        items: o.items.map((item, itemIdx) => ({
          id: `oi${this.nextId * 100 + idx * 10 + itemIdx}`,
          name: item.name,
          price: item.price
        }))
      }))
    };

    this.menus.push(newMenu);
    await new Promise(resolve => setTimeout(resolve, 300));
    return newMenu;
  }

  async updateMenu(
    id: string,
    menuDto: Partial<CreateMenuRequestDTO>
  ): Promise<MenuResponseDTO> {
    const index = this.menus.findIndex(m => m.id === id);

    if (index === -1) {
      throw new Error(`Menu with id ${id} not found`);
    }

    const existingMenu = this.menus[index];
    const updatedMenu: MenuResponseDTO = {
      ...existingMenu,
      ...(menuDto.type && { type: menuDto.type }),
      ...(menuDto.sub_type && { sub_type: menuDto.sub_type }),
      ...(menuDto.name && { name: menuDto.name }),
      ...(menuDto.is_active !== undefined && { is_active: menuDto.is_active }),
      ...(menuDto.variants && {
        variants: menuDto.variants.map((v, idx) => ({
          id: existingMenu.variants[idx]?.id || `v${Date.now() + idx}`,
          name: v.name,
          display_name: v.display_name,
          price: v.price,
          sku: v.sku,
          kitchen_id: v.kitchen_id,
          is_default: v.is_default ?? false,
          is_active: v.is_active ?? true
        }))
      }),
      ...(menuDto.options && {
        options: menuDto.options.map((o, idx) => ({
          id: existingMenu.options?.[idx]?.id || `o${Date.now() + idx}`,
          name: o.name,
          required: o.required,
          multiple: o.multiple,
          items: o.items.map((item, itemIdx) => ({
            id: existingMenu.options?.[idx]?.items[itemIdx]?.id || `oi${Date.now() + idx * 10 + itemIdx}`,
            name: item.name,
            price: item.price
          }))
        }))
      })
    };

    this.menus[index] = updatedMenu;
    await new Promise(resolve => setTimeout(resolve, 300));
    return updatedMenu;
  }

  async deleteMenu(id: string): Promise<void> {
    const index = this.menus.findIndex(m => m.id === id);

    if (index === -1) {
      throw new Error(`Menu with id ${id} not found`);
    }

    this.menus.splice(index, 1);
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}
