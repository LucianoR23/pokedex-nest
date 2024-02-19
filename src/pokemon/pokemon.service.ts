import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto )
      return pokemon;
    } catch (error) {
      this.handleExceptions( error )
    }

  }

  async findAll() {
    const pokemons = await this.pokemonModel.find()

    return pokemons
  }

  async findOne(searchParam: string) {
    let pokemon: Pokemon;

    if( !isNaN(+searchParam) ){
      pokemon = await this.pokemonModel.findOne({ pokedexNumber: searchParam })
    }

    if( !pokemon && isValidObjectId( searchParam ) ){
      pokemon = await this.pokemonModel.findById( searchParam )
    }

    if( !pokemon ){
      pokemon = await this.pokemonModel.findOne({ name: searchParam.toLowerCase().trim() })
    }

    if( !pokemon ) throw new NotFoundException(`El pokemon ${searchParam} no se encontro`)
    
    return pokemon
  }

  async update(searchParam: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( searchParam );
    // if( pokemon.name === updatePokemonDto.name || pokemon.pokedexNumber === updatePokemonDto.pokedexNumber ) throw new BadRequestException(`Ya existe un pokemon con esos datos`)
    if( updatePokemonDto.name ) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
    
    try {
      
      await pokemon.updateOne( updatePokemonDto, { new: true } )
  
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions( error )
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne( id )
    // await pokemon.deleteOne()
    // const result = await this.pokemonModel.findByIdAndDelete( id )
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })

    if( deletedCount === 0 ){
      throw new BadRequestException(`Pokemon con id "${id}" no fue encontrado`)
    }

    return {
      msg: `El pokemon con id "${id}" ha sido eliminado`
    };
  }

  private handleExceptions( error: any ){
    if( error.code === 11000){
      console.log(error)
      throw new BadRequestException(`El pokemon existe en la base de datos ${ JSON.stringify( error.keyValue ) }`)
    }

    console.log(error)
    throw new InternalServerErrorException(`No se puede actualizar el pokemon - Chequear log del servidor`)
  }

}
