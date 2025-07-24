import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Property = Tables<'leiloes_imoveis'>;

// Operações CRUD usando o cliente Supabase
export class PropertyCRUD {
  
  // Criar nova propriedade
  static async createProperty(data: Partial<Property>): Promise<Property> {
    try {
      // Remove o ID se estiver presente (será auto-gerado)
      const { id, ...dataWithoutId } = data as any;
      
      const { data: newProperty, error } = await supabase
        .from('leiloes_imoveis')
        .insert([dataWithoutId])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar propriedade: ${error.message}`);
      }

      return newProperty;
    } catch (error) {
      console.error('Erro ao criar propriedade:', error);
      throw error;
    }
  }

  // Atualizar propriedade existente
  static async updateProperty(id: number, data: Partial<Property>): Promise<Property> {
    try {
      // Remove o ID dos dados (não deve ser atualizado)
      const { id: _, ...dataWithoutId } = data as any;

      const { data: updatedProperty, error } = await supabase
        .from('leiloes_imoveis')
        .update(dataWithoutId)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar propriedade: ${error.message}`);
      }

      return updatedProperty;
    } catch (error) {
      console.error('Erro ao atualizar propriedade:', error);
      throw error;
    }
  }

  // Excluir propriedade
  static async deleteProperty(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('leiloes_imoveis')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Erro ao excluir propriedade: ${error.message}`);
      }
    } catch (error) {
      console.error('Erro ao excluir propriedade:', error);
      throw error;
    }
  }
} 