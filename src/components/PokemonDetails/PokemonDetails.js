import React from "react";
import './PokemonDetails.css'


export default function PokemonDetails(props) {
    return (
        <div>
            <div className="btn btn-common">
                <button onClick={props.closeDetails}>Back</button>
            </div>
            
            <div className="pokemon-card card">
                <div className="card-img">
                    <img src={props.data.sprites.front_default} alt="Pokemon" />
                    <p className="card-name">
                        {props.data.name}
                    </p>
                </div>
            
                <div className="card-types">
                    {
                        props.data.types.map((type,index) => {
                            return (
                                <div key={index} className="card-type">
                                    {type.type.name}
                                </div>
                            )
                        })
                    }
                </div>
                <div className="card-info">
                    <div className="card-data">
                        <p className="title">Weight</p>
                        <p>{props.data.weight}</p>
                    </div>
                    <div className="card-data">
                        <p className="title">Height</p>
                        <p>{props.data.height}</p>
                    </div>
                    <div className="card-data">
                        <p className="title">Ability</p>
                        <p>
                            {
                                props.data.abilities.map(item => {
                                    return item.ability.name
                                }).join(", ")
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}