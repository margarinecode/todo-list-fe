import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [activeStatus, setActiveStatus] = useState('all')
    const [data, setData] = useState([])
    const [dataFiltered, setDataFiltered] = useState([])
    const [newTitle, setNewTitle] = useState('')
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
            await axios.put(`https://todo-list-be-production.up.railway.app/api/todo/${val.id}`, {
                title: val.title,
                completed: !val.completed
            })
            getData()

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
                return <label className={'todo-list'} key={val.id}>{val.title}
                    <input
                        type={'checkbox'}
                        key={val.id}
                        defaultChecked={val.completed}
                        onClick={()=>{handleUpdate(val)}}
                    />
                    <span className={'checkmark'}></span>
                    {val.completed ? <hr className={'line'} /> : ''}
                </label>
            })}
        </div>
    </div>
  );
}

export default App;
