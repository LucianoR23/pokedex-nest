import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios

  async executedSeed(){
    const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=649')

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/')
      const pokemonNumber = +segments[ segments.length - 2 ]

    })
    
    return data.results
  }
}
