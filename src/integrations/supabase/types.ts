export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      advertisements: {
        Row: {
          created_at: string | null
          description: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          link_text: string | null
          link_url: string | null
          media_type: string | null
          media_url: string | null
          priority: number | null
          starts_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          media_type?: string | null
          media_url?: string | null
          priority?: number | null
          starts_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          media_type?: string | null
          media_url?: string | null
          priority?: number | null
          starts_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      article_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_likes: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_purchases: {
        Row: {
          amount: number
          article_id: string
          created_at: string | null
          id: string
          payment_id: string | null
          purchased_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          article_id: string
          created_at?: string | null
          id?: string
          payment_id?: string | null
          purchased_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          article_id?: string
          created_at?: string | null
          id?: string
          payment_id?: string | null
          purchased_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_purchases_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_purchases_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      article_reactions: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          reaction_type: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_reactions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_share_counts: {
        Row: {
          article_id: string
          facebook: number | null
          linkedin: number | null
          telegram: number | null
          total: number | null
          twitter: number | null
          updated_at: string | null
          whatsapp: number | null
        }
        Insert: {
          article_id: string
          facebook?: number | null
          linkedin?: number | null
          telegram?: number | null
          total?: number | null
          twitter?: number | null
          updated_at?: string | null
          whatsapp?: number | null
        }
        Update: {
          article_id?: string
          facebook?: number | null
          linkedin?: number | null
          telegram?: number | null
          total?: number | null
          twitter?: number | null
          updated_at?: string | null
          whatsapp?: number | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string
          category: string | null
          content_de: string | null
          content_en: string | null
          content_es: string | null
          content_fr: string | null
          cover_image: string | null
          created_at: string | null
          excerpt_de: string | null
          excerpt_en: string | null
          excerpt_es: string | null
          excerpt_fr: string | null
          id: string
          is_premium: boolean | null
          likes: number | null
          media: Json | null
          price: number | null
          published_at: string | null
          rejection_reason: string | null
          status: string | null
          title_de: string
          title_en: string
          title_es: string
          title_fr: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id: string
          category?: string | null
          content_de?: string | null
          content_en?: string | null
          content_es?: string | null
          content_fr?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt_de?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          excerpt_fr?: string | null
          id?: string
          is_premium?: boolean | null
          likes?: number | null
          media?: Json | null
          price?: number | null
          published_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          title_de: string
          title_en: string
          title_es: string
          title_fr: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string
          category?: string | null
          content_de?: string | null
          content_en?: string | null
          content_es?: string | null
          content_fr?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt_de?: string | null
          excerpt_en?: string | null
          excerpt_es?: string | null
          excerpt_fr?: string | null
          id?: string
          is_premium?: boolean | null
          likes?: number | null
          media?: Json | null
          price?: number | null
          published_at?: string | null
          rejection_reason?: string | null
          status?: string | null
          title_de?: string
          title_en?: string
          title_es?: string
          title_fr?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          clicks: number | null
          content: Json | null
          created_at: string | null
          end_date: string | null
          id: string
          impressions: number | null
          is_active: boolean | null
          name: string
          start_date: string | null
          target_audience: string | null
          type: string | null
        }
        Insert: {
          clicks?: number | null
          content?: Json | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          impressions?: number | null
          is_active?: boolean | null
          name: string
          start_date?: string | null
          target_audience?: string | null
          type?: string | null
        }
        Update: {
          clicks?: number | null
          content?: Json | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          impressions?: number | null
          is_active?: boolean | null
          name?: string
          start_date?: string | null
          target_audience?: string | null
          type?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name_de: string
          name_en: string
          name_es: string
          name_fr: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name_de: string
          name_en: string
          name_es: string
          name_fr: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name_de?: string
          name_en?: string
          name_es?: string
          name_fr?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          commission_amount: number
          commission_rate: number | null
          created_at: string | null
          id: string
          order_id: string | null
          order_item_id: string | null
          paid_at: string | null
          sale_amount: number
          status: string | null
          vendor_id: string
        }
        Insert: {
          commission_amount: number
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          order_item_id?: string | null
          paid_at?: string | null
          sale_amount: number
          status?: string | null
          vendor_id: string
        }
        Update: {
          commission_amount?: number
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          order_item_id?: string | null
          paid_at?: string | null
          sale_amount?: number
          status?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          created_at: string | null
          discount_amount: number | null
          id: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          used_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      delivery_proofs: {
        Row: {
          created_at: string | null
          delivery_user_id: string
          id: string
          location_address: string | null
          location_lat: number | null
          location_lng: number | null
          notes: string | null
          order_id: string
          proof_type: string
          recipient_cni_photo_url: string | null
          recipient_name: string | null
          recipient_photo_url: string | null
          signature_url: string | null
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_user_id: string
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          order_id: string
          proof_type: string
          recipient_cni_photo_url?: string | null
          recipient_name?: string | null
          recipient_photo_url?: string | null
          signature_url?: string | null
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_user_id?: string
          id?: string
          location_address?: string | null
          location_lat?: number | null
          location_lng?: number | null
          notes?: string | null
          order_id?: string
          proof_type?: string
          recipient_cni_photo_url?: string | null
          recipient_name?: string | null
          recipient_photo_url?: string | null
          signature_url?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_proofs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_content: {
        Row: {
          author_id: string
          content_type: string
          created_at: string | null
          description: string | null
          downloads: number | null
          file_url: string | null
          grade_level: string | null
          id: string
          is_approved: boolean | null
          is_free: boolean | null
          preview_url: string | null
          price: number | null
          rating_avg: number | null
          rating_count: number | null
          subject: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content_type?: string
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          is_approved?: boolean | null
          is_free?: boolean | null
          preview_url?: string | null
          price?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          subject?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content_type?: string
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          is_approved?: boolean | null
          is_free?: boolean | null
          preview_url?: string | null
          price?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          subject?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_campaign_logs: {
        Row: {
          campaign_id: string | null
          error_message: string | null
          id: string
          recipient_email: string
          resend_id: string | null
          sent_at: string
          status: string
        }
        Insert: {
          campaign_id?: string | null
          error_message?: string | null
          id?: string
          recipient_email: string
          resend_id?: string | null
          sent_at?: string
          status: string
        }
        Update: {
          campaign_id?: string | null
          error_message?: string | null
          id?: string
          recipient_email?: string
          resend_id?: string | null
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaign_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          created_at: string
          created_by: string | null
          failed_count: number | null
          html_content: string
          id: string
          name: string
          preheader: string | null
          recipients_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          sent_count: number | null
          status: string
          subject: string
          template_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          failed_count?: number | null
          html_content: string
          id?: string
          name: string
          preheader?: string | null
          recipients_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject: string
          template_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          failed_count?: number | null
          html_content?: string
          id?: string
          name?: string
          preheader?: string | null
          recipients_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject?: string
          template_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          email_type: string
          error_message: string | null
          id: string
          order_id: string | null
          recipient_email: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          email_type: string
          error_message?: string | null
          id?: string
          order_id?: string | null
          recipient_email: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          email_type?: string
          error_message?: string | null
          id?: string
          order_id?: string | null
          recipient_email?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      faq: {
        Row: {
          answer_en: string | null
          answer_fr: string
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          question_en: string | null
          question_fr: string
          sort_order: number | null
        }
        Insert: {
          answer_en?: string | null
          answer_fr: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question_en?: string | null
          question_fr: string
          sort_order?: number | null
        }
        Update: {
          answer_en?: string | null
          answer_fr?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question_en?: string | null
          question_fr?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      internal_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          parent_id: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          parent_id?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          parent_id?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "internal_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      login_sessions: {
        Row: {
          confirmed_at: string | null
          created_at: string | null
          device_info: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          is_blocked: boolean | null
          is_confirmed: boolean | null
          user_id: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string | null
          device_info?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_blocked?: boolean | null
          is_confirmed?: boolean | null
          user_id: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string | null
          device_info?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_blocked?: boolean | null
          is_confirmed?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_used: boolean | null
          points_spent: number
          reward_type: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          points_spent: number
          reward_type: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_used?: boolean | null
          points_spent?: number
          reward_type?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      moderator_notes: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          is_resolved: boolean | null
          moderator_id: string
          note: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_resolved?: boolean | null
          moderator_id: string
          note: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_resolved?: boolean | null
          moderator_id?: string
          note?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirmation_sent_at: string | null
          confirmation_token: string
          confirmed: boolean
          confirmed_at: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          source: string | null
          subscribed_at: string
          unsubscribe_token: string
          unsubscribed_at: string | null
        }
        Insert: {
          confirmation_sent_at?: string | null
          confirmation_token?: string
          confirmed?: boolean
          confirmed_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Update: {
          confirmation_sent_at?: string | null
          confirmation_token?: string
          confirmed?: boolean
          confirmed_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          source?: string | null
          subscribed_at?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          customer_confirmed_at: string | null
          delivery_delivered_at: string | null
          delivery_notes: string | null
          delivery_received_at: string | null
          delivery_user_id: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_reference: string | null
          phone: string | null
          shipping_address: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          customer_confirmed_at?: string | null
          delivery_delivered_at?: string | null
          delivery_notes?: string | null
          delivery_received_at?: string | null
          delivery_user_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          phone?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          customer_confirmed_at?: string | null
          delivery_delivered_at?: string | null
          delivery_notes?: string | null
          delivery_received_at?: string | null
          delivery_user_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          phone?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          order_id: string | null
          payment_method: string
          payment_reference: string | null
          phone_number: string | null
          status: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          payment_method: string
          payment_reference?: string | null
          phone_number?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          payment_method?: string
          payment_reference?: string | null
          phone_number?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          author_details: string | null
          author_name: string | null
          brand: string | null
          category_id: string | null
          color: string | null
          created_at: string | null
          description_de: string | null
          description_en: string | null
          description_es: string | null
          description_fr: string | null
          dimensions: string | null
          discount_percent: number | null
          education_level: string | null
          education_series: string | null
          free_shipping: boolean | null
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          is_office_supply: boolean | null
          material: string | null
          model: string | null
          name_de: string
          name_en: string
          name_es: string
          name_fr: string
          original_price: number | null
          price: number
          product_genre: string | null
          product_type: string | null
          stock: number | null
          subject: string | null
          updated_at: string | null
          vendor_id: string | null
          views: number
        }
        Insert: {
          author_details?: string | null
          author_name?: string | null
          brand?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_fr?: string | null
          dimensions?: string | null
          discount_percent?: number | null
          education_level?: string | null
          education_series?: string | null
          free_shipping?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_office_supply?: boolean | null
          material?: string | null
          model?: string | null
          name_de: string
          name_en: string
          name_es: string
          name_fr: string
          original_price?: number | null
          price: number
          product_genre?: string | null
          product_type?: string | null
          stock?: number | null
          subject?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          views?: number
        }
        Update: {
          author_details?: string | null
          author_name?: string | null
          brand?: string | null
          category_id?: string | null
          color?: string | null
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_fr?: string | null
          dimensions?: string | null
          discount_percent?: number | null
          education_level?: string | null
          education_series?: string | null
          free_shipping?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          is_office_supply?: boolean | null
          material?: string | null
          model?: string | null
          name_de?: string
          name_en?: string
          name_es?: string
          name_fr?: string
          original_price?: number | null
          price?: number
          product_genre?: string | null
          product_type?: string | null
          stock?: number | null
          subject?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          preferred_language: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          applies_to: string | null
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_type: string | null
          discount_value: number
          end_date: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_amount: number | null
          name: string
          start_date: string | null
        }
        Insert: {
          applies_to?: string | null
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string | null
          discount_value: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_amount?: number | null
          name: string
          start_date?: string | null
        }
        Update: {
          applies_to?: string | null
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_amount?: number | null
          name?: string
          start_date?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          attempts: number | null
          blocked_until: string | null
          first_attempt_at: string | null
          id: string
          identifier: string
          last_attempt_at: string | null
        }
        Insert: {
          action_type: string
          attempts?: number | null
          blocked_until?: string | null
          first_attempt_at?: string | null
          id?: string
          identifier: string
          last_attempt_at?: string | null
        }
        Update: {
          action_type?: string
          attempts?: number | null
          blocked_until?: string | null
          first_attempt_at?: string | null
          id?: string
          identifier?: string
          last_attempt_at?: string | null
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          amount: number
          claimed_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_claimed: boolean | null
          referral_id: string
          reward_type: string
          user_id: string
        }
        Insert: {
          amount?: number
          claimed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_claimed?: boolean | null
          referral_id: string
          reward_type?: string
          user_id: string
        }
        Update: {
          amount?: number
          claimed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_claimed?: boolean | null
          referral_id?: string
          reward_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_id: string | null
          referrer_id: string
          reward_given: boolean | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_id?: string | null
          referrer_id: string
          reward_given?: boolean | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_id?: string | null
          referrer_id?: string
          reward_given?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          author_id: string | null
          category: Database["public"]["Enums"]["resource_category"]
          created_at: string | null
          description_de: string | null
          description_en: string | null
          description_es: string | null
          description_fr: string | null
          downloads: number | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          grade_level: string | null
          id: string
          is_free: boolean | null
          price: number | null
          subject: string | null
          title_de: string
          title_en: string
          title_es: string
          title_fr: string
        }
        Insert: {
          author_id?: string | null
          category: Database["public"]["Enums"]["resource_category"]
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_fr?: string | null
          downloads?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          is_free?: boolean | null
          price?: number | null
          subject?: string | null
          title_de: string
          title_en: string
          title_es: string
          title_fr: string
        }
        Update: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["resource_category"]
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_es?: string | null
          description_fr?: string | null
          downloads?: number | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          grade_level?: string | null
          id?: string
          is_free?: boolean | null
          price?: number | null
          subject?: string | null
          title_de?: string
          title_en?: string
          title_es?: string
          title_fr?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string
          rating: number | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id: string
          rating?: number | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      school_loyalty: {
        Row: {
          created_at: string | null
          id: string
          school_id: string
          tier: string | null
          total_orders: number | null
          total_points: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          school_id: string
          tier?: string | null
          total_orders?: number | null
          total_points?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          school_id?: string
          tier?: string | null
          total_orders?: number | null
          total_points?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_loyalty_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_loyalty_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools_public"
            referencedColumns: ["id"]
          },
        ]
      }
      school_supply_items: {
        Row: {
          id: string
          is_required: boolean | null
          item_name: string
          list_id: string
          notes: string | null
          product_id: string | null
          quantity: number
          sort_order: number | null
        }
        Insert: {
          id?: string
          is_required?: boolean | null
          item_name: string
          list_id: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          sort_order?: number | null
        }
        Update: {
          id?: string
          is_required?: boolean | null
          item_name?: string
          list_id?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "school_supply_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "school_supply_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_supply_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      school_supply_lists: {
        Row: {
          created_at: string | null
          created_by: string
          grade_level: string
          id: string
          is_published: boolean | null
          name: string
          school_id: string
          school_year: string
          series: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          grade_level: string
          id?: string
          is_published?: boolean | null
          name: string
          school_id: string
          school_year?: string
          series?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          grade_level?: string
          id?: string
          is_published?: boolean | null
          name?: string
          school_id?: string
          school_year?: string
          series?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_supply_lists_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "school_supply_lists_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools_public"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          admin_user_id: string | null
          city: string | null
          code: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          region: string | null
          student_count: number | null
          type: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          admin_user_id?: string | null
          city?: string | null
          code?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          region?: string | null
          student_count?: number | null
          type?: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          admin_user_id?: string | null
          city?: string | null
          code?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          region?: string | null
          student_count?: number | null
          type?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      smart_kit_items: {
        Row: {
          id: string
          is_required: boolean | null
          item_name: string
          kit_id: string
          product_id: string | null
          quantity: number
          sort_order: number | null
        }
        Insert: {
          id?: string
          is_required?: boolean | null
          item_name: string
          kit_id: string
          product_id?: string | null
          quantity?: number
          sort_order?: number | null
        }
        Update: {
          id?: string
          is_required?: boolean | null
          item_name?: string
          kit_id?: string
          product_id?: string | null
          quantity?: number
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_kit_items_kit_id_fkey"
            columns: ["kit_id"]
            isOneToOne: false
            referencedRelation: "smart_kits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smart_kit_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_kits: {
        Row: {
          created_at: string | null
          description: string | null
          discount_price: number | null
          grade_level: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          school_type: string | null
          series: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          grade_level: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          school_type?: string | null
          series?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          grade_level?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          school_type?: string | null
          series?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          address: string
          city: string
          created_at: string | null
          id: string
          is_default: boolean
          name: string
          phone: string | null
          region: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          id?: string
          is_default?: boolean
          name: string
          phone?: string | null
          region: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          id?: string
          is_default?: boolean
          name?: string
          phone?: string | null
          region?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_settings: {
        Row: {
          address: string | null
          banner_url: string | null
          city: string | null
          commission_rate: number | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          pending_payout: number | null
          phone: string | null
          store_description: string | null
          store_name: string
          total_earnings: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          banner_url?: string | null
          city?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          pending_payout?: number | null
          phone?: string | null
          store_description?: string | null
          store_name: string
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          banner_url?: string | null
          city?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          pending_payout?: number | null
          phone?: string | null
          store_description?: string | null
          store_name?: string
          total_earnings?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      view_tracking: {
        Row: {
          entity_id: string
          entity_type: string
          id: string
          session_fingerprint: string
          viewed_at: string
        }
        Insert: {
          entity_id: string
          entity_type: string
          id?: string
          session_fingerprint: string
          viewed_at?: string
        }
        Update: {
          entity_id?: string
          entity_type?: string
          id?: string
          session_fingerprint?: string
          viewed_at?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      promotions_public: {
        Row: {
          applies_to: string | null
          description: string | null
          discount_type: string | null
          discount_value: number | null
          end_date: string | null
          id: string | null
          is_active: boolean | null
          min_amount: number | null
          name: string | null
          start_date: string | null
        }
        Insert: {
          applies_to?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          end_date?: string | null
          id?: string | null
          is_active?: boolean | null
          min_amount?: number | null
          name?: string | null
          start_date?: string | null
        }
        Update: {
          applies_to?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          end_date?: string | null
          id?: string | null
          is_active?: boolean | null
          min_amount?: number | null
          name?: string | null
          start_date?: string | null
        }
        Relationships: []
      }
      schools_public: {
        Row: {
          address: string | null
          city: string | null
          code: string | null
          created_at: string | null
          id: string | null
          is_verified: boolean | null
          logo_url: string | null
          name: string | null
          region: string | null
          student_count: number | null
          type: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code?: string | null
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string | null
          region?: string | null
          student_count?: number | null
          type?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string | null
          created_at?: string | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string | null
          region?: string | null
          student_count?: number | null
          type?: string | null
          website?: string | null
        }
        Relationships: []
      }
      vendor_public_info: {
        Row: {
          banner_url: string | null
          city: string | null
          id: string | null
          is_verified: boolean | null
          logo_url: string | null
          store_description: string | null
          store_name: string | null
          user_id: string | null
        }
        Insert: {
          banner_url?: string | null
          city?: string | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          store_description?: string | null
          store_name?: string | null
          user_id?: string | null
        }
        Update: {
          banner_url?: string | null
          city?: string | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          store_description?: string | null
          store_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_password_strength: { Args: { _password: string }; Returns: boolean }
      check_rate_limit: {
        Args: {
          _action_type: string
          _block_seconds?: number
          _identifier: string
          _max_attempts?: number
          _window_seconds?: number
        }
        Returns: {
          allowed: boolean
          blocked_until: string
          remaining_attempts: number
        }[]
      }
      cleanup_expired_data: { Args: never; Returns: undefined }
      cleanup_old_login_sessions: { Args: never; Returns: undefined }
      cleanup_old_view_tracking: { Args: never; Returns: undefined }
      confirm_newsletter_subscription: {
        Args: { _token: string }
        Returns: {
          email: string
          success: boolean
        }[]
      }
      generate_referral_code: { Args: never; Returns: string }
      get_admin_stats: {
        Args: never
        Returns: {
          monthly_revenue: number
          pending_orders: number
          total_articles: number
          total_orders: number
          total_products: number
          total_revenue: number
          total_users: number
        }[]
      }
      get_delivery_orders: {
        Args: { _delivery_user_id: string }
        Returns: {
          coupon_code: string | null
          created_at: string | null
          customer_confirmed_at: string | null
          delivery_delivered_at: string | null
          delivery_notes: string | null
          delivery_received_at: string | null
          delivery_user_id: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_reference: string | null
          phone: string | null
          shipping_address: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "orders"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_delivery_stats: {
        Args: { _delivery_user_id: string }
        Returns: {
          delivered: number
          in_transit: number
          pending_pickup: number
          total_assigned: number
        }[]
      }
      get_share_stats: {
        Args: { _end_date?: string; _start_date?: string }
        Returns: {
          article_id: string
          facebook: number
          linkedin: number
          telegram: number
          title_fr: string
          total: number
          twitter: number
          whatsapp: number
        }[]
      }
      get_user_loyalty_points: {
        Args: never
        Returns: {
          available: number
          total_earned: number
          total_spent: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_article_share: {
        Args: { _article_id: string; _platform: string }
        Returns: {
          article_id: string
          facebook: number | null
          linkedin: number | null
          telegram: number | null
          total: number | null
          twitter: number | null
          updated_at: string | null
          whatsapp: number | null
        }
        SetofOptions: {
          from: "*"
          to: "article_share_counts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      increment_article_views: {
        Args: { _article_id: string }
        Returns: undefined
      }
      increment_product_views: {
        Args: { _product_id: string }
        Returns: undefined
      }
      redeem_loyalty_points: {
        Args: { _points_required: number; _reward_type: string }
        Returns: {
          coupon_code: string
          message: string
          reward_id: string
          success: boolean
        }[]
      }
      revoke_blocked_session: {
        Args: { _session_id: string }
        Returns: boolean
      }
      validate_coupon: {
        Args: { _code: string; _order_total: number }
        Returns: {
          coupon_id: string
          discount_amount: number
          discount_percent: number
          discount_value: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "vendor" | "delivery"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      resource_category: "secondary" | "university"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "vendor", "delivery"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      resource_category: ["secondary", "university"],
    },
  },
} as const
