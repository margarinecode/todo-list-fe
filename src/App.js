import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import {Create, DeleteForever} from "@mui/icons-material";

function App() {
    const [activeStatus, setActiveStatus] = useState('all')
    const [data, setData] = useState([])
    const [dataFiltered, setDataFiltered] = useState([])
    const [newTitle, setNewTitle] = useState('')
    const [editMode, setEditMode] = useState(-1)
    const [editTitle, setEditTile] = useState('')
    const status = ['all', 'active', 'completed']

    useEffect(()=>{
        getData()
    },[])

    const getData = async () =>{
        try{
            const res = await axios.get('https://todo-list-be-production.up.railway.app/api/todo')
            setData(res.data)
            setDataFiltered(res.data)
            console.log(res)
        }catch (e){
            console.log(e)
        }
    }
    const filterStatus = (s) => {
        if(s === 'all'){
            setDataFiltered(data)
        }else if(s === 'active'){
            setDataFiltered(data.filter((val)=>!val.completed))
        }else if(s === 'completed'){
            setDataFiltered(data.filter((val)=>val.completed))
        }

        setActiveStatus(s)
    }

    const handleCreate = async () => {
        try {
            if(newTitle !== ''){
                await axios.post('https://todo-list-be-production.up.railway.app/api/todo', {
                    title: newTitle,
                    completed: false
                })
                setNewTitle('')
                getData()
            }
        }catch (e){
            console.log(e)
        }
    }

    const handleUpdate = async (val) => {
        try {
            await axios.put(`https://todo-list-be-production.up.railway.app/api/todo/${val.id}`, val)
            getData()
            setEditMode(-1)

        }catch (e){
            console.log(e)
        }
    }
    const handleDelete = async (val) => {
        try {
            await axios.delete(`https://todo-list-be-production.up.railway.app/api/todo/${val.id}`)
            getData()
            setEditMode(-1)

        }catch (e){
            console.log(e)
        }
    }

  return (
    <div className="App">
      <div className={'title'}>What's the plan for today?</div>
        <div className={'search-box'}>
            <input
                placeholder={'what to do'}
                className={'add-input'}
                value={newTitle}
                onChange={event => setNewTitle(event.target.value)}
            />
            <button className={'add-button'} onClick={handleCreate}>Add</button>
        </div>
        <div className={'filter'}>
            {status.map((val)=>{
                return <div
                    key={val}
                    className={'filter-box'}
                    style={{background: activeStatus === val? 'rgb(26 174 159)' : 'rgb(120 136 150)'}}
                    onClick={()=>{filterStatus(val)}}
                >
                    {val.toUpperCase()}
                </div>
            })}
        </div>
        <div className={'list-box'}>
            {dataFiltered.map((val)=>{
                return <label className={'todo-list'} key={val.id}>
                    {editMode === val.id ? <div>
                        <input
                            className={'edit-title'}
                            defaultValue={val.title}
                            onChange={(event)=>{setEditTile(event.target.value)}}
                            onKeyUp={
                            (event) =>
                                event.key === 'Enter' && handleUpdate({...val, title: editTitle})
                        }
                        />
                    </div> : <div>
                        {val.title}
                        <input
                            type={'checkbox'}
                            className={'checkbox'}
                            key={val.id}
                            checked={val.completed}
                            disabled
                        />
                        <span className={'checkmark'} onClick={()=>handleUpdate({...val, completed: !val.completed})}></span>
                    </div>}

                    {val.completed ? <hr className={'line'} /> : <div className={'action'}>
                        <Create style={{color: '#4a5b6a', height: '18px'}} onClick={()=>{
                            if(val.id !== editMode) {
                                setEditMode(val.id)
                            }else {
                                setEditMode(-1)
                            }
                        }}/>
                        <DeleteForever style={{color: '#4a5b6a', height: '18px'}} onClick={()=>handleDelete(val)}/>
                    </div>}
                </label>
            })}
        </div>
    </div>
  );
}

export default App;
