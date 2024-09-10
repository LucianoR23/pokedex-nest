import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapter/axios.adapter';

@Injectable()
export class SeedService {


  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
  ){}

  async executedSeed(){
    await this.pokemonModel.deleteMany()

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=649')

    const pokemonToInsert: { name: string, pokedexNumber: number }[] = []

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/')
      const pokedexNumber = +segments[ segments.length - 2 ]

      // await this.pokemonService.create({name, pokedexNumber})

      pokemonToInsert.push({name, pokedexNumber})
    })

    await this.pokemonModel.insertMany( pokemonToInsert )
    
    return 'Base de datos cargada'
  }
}
