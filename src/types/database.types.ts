export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          image_url: string
          rating: number
          review_count: number
          delivery_time: string
          is_open: boolean
          delivery_fee: number | null
          min_order: number | null
          distance_km: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          rating?: number
          review_count?: number
          delivery_time: string
          is_open?: boolean
          delivery_fee?: number | null
          min_order?: number | null
          distance_km?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          rating?: number
          review_count?: number
          delivery_time?: string
          is_open?: boolean
          delivery_fee?: number | null
          min_order?: number | null
          distance_km?: number | null
          distance?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          created_at?: string
        }
      }
      restaurant_categories: {
        Row: {
          restaurant_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          restaurant_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          restaurant_id?: string
          category_id?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      restaurant_tags: {
        Row: {
          restaurant_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          restaurant_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          restaurant_id?: string
          tag_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
