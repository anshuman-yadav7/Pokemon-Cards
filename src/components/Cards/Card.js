import React from "react";
import './Card.css';

function Card({pokemon, onClick}) {
    return (
        <div className="card" onClick={()=>onClick()}>
            <div className="card-img">
                <img src={pokemon.sprites.front_default} alt="" />
                <p className="card-name">
                    {pokemon.name}
                </p>
            </div>
            
            <div className="card-types">
                {
                    pokemon.types.map((type, index) => {
                        return (
                            <div key={index}className="card-type">
                                {type.type.name}
                            </div>
                        )
                    })
                }
            </div>
            <div className="card-info">
                <div className="card-data">
                    <p className="title">Weight</p>
                    <p>{pokemon.weight}</p>
                </div>
                <div className="card-data">
                    <p className="title">Height</p>
                    <p>{pokemon.height}</p>
                </div>
                <div className="card-data">
                    <p className="title">Ability</p>
                    <p>{pokemon.abilities[0].ability.name}</p>
                </div>
            </div>
        </div>
    )
}

export default Card;