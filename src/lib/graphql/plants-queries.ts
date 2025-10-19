import { gql } from 'graphql-tag';
import type { 
  Plant, 
  CreatePlantInput, 
  UpdatePlantInput, 
  PlantFilterInput,
  PlantsResponse,
  PlantResponse,
  PlantMutationResponse,
  PlantDeleteResponse
} from './types';

// GraphQL Queries para Plantas
export const GET_PLANTS = gql`
  query GetPlants($filter: PlantFilterInput) {
    plants(filter: $filter) {
      plants {
        id
        name
        species
        description
        user_id
        photo_filename
        created_at
        updated_at
      }
      total
      page
      limit
    }
  }
`;

export const GET_PLANT = gql`
  query GetPlant($id: String!) {
    plant(id: $id) {
      plant {
        id
        name
        species
        description
        user_id
        photo_filename
        created_at
        updated_at
      }
    }
  }
`;

export const GET_USER_PLANTS = gql`
  query GetUserPlants($userId: String!, $filter: PlantFilterInput) {
    userPlants(userId: $userId, filter: $filter) {
      plants {
        id
        name
        species
        description
        user_id
        photo_filename
        created_at
        updated_at
      }
      total
      page
      limit
    }
  }
`;

// Mutations
export const CREATE_PLANT = gql`
  mutation CreatePlant($input: CreatePlantInput!) {
    createPlant(input: $input) {
      success
      message
      plant {
        id
        name
        species
        description
        user_id
        photo_filename
        created_at
        updated_at
      }
    }
  }
`;

export const UPDATE_PLANT = gql`
  mutation UpdatePlant($id: String!, $input: UpdatePlantInput!) {
    updatePlant(id: $id, input: $input) {
      success
      message
      plant {
        id
        name
        species
        description
        user_id
        photo_filename
        created_at
        updated_at
      }
    }
  }
`;

export const DELETE_PLANT = gql`
  mutation DeletePlant($id: String!) {
    deletePlant(id: $id) {
      success
      message
    }
  }
`;

// Los tipos ya están definidos en types.ts
