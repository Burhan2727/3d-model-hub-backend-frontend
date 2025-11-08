import React from 'react';
import { use } from 'react';
import { useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import { ModelCard } from '../../components/ModelCard';

const MyModels = () => {
    const {user} = use(AuthContext)
    const [models, setModels] = useState([])
    const [loading, setLoading] = useState(true)
    console.log(user)
    useEffect(()=>{
        fetch(`https://3d-models-hub-server-eta.vercel.app/my-models?email=${user.email}`, {
            headers: {
                authorization: `Bearer ${user.accessToken}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setModels(data)
            setLoading(false)
        })
    }, [])
    if(loading){
        <div>Please Wait....</div>
    }
    return (
        <div>
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
                     {
                      models.map(model => <ModelCard key={model._id} model={model}></ModelCard>)
                     }
                  </div>
        </div>
    );
};

export default MyModels;