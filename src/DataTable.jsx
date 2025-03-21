import React, {useState,useEffect,useRef} from 'react';

const DataTable = () => {

    const [formData,setFormData] = useState({name: "", gender: "", age: ""});
    const [data,setData] = useState([]);
    const [editId,setEditId] = useState(false);
    const [search,setSearch] = useState(" ");
    const [currentPage,setCurrentPage] = useState(1);
    const outSideClick = useRef(false);
    const itemPerPage = 5;
    const lastItem = currentPage * itemPerPage;
    const firstItem = lastItem - itemPerPage;
    let filteredItems = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    const filteredData = filteredItems.slice(firstItem,lastItem)
    useEffect(() => {
       setCurrentPage(1);
    },[search]);

    useEffect(() => {
        if(!editId) return;
        let selectedItem = document.querySelectorAll(`[id='${editId}']`);
        selectedItem[0].focus();
    },[editId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(outSideClick.current && !outSideClick.current.contains(event.target)){
                setEditId(false);
            }
        };

        document.addEventListener("click",handleClickOutside);

        return () => {
            document.removeEventListener("click",handleClickOutside);
        };
    },[]);

    const handleInputChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
    };

    const handleAddClick = () => {
        if(formData.name && formData.gender && formData.age){
            const newItem = {
                id: Date.now(),
                name: formData.name,
                gender: formData.gender,
                age: formData.age
            };
            setData([...data,newItem]);
            setFormData({name: "", gender: "", age: ""});
        }
    };
    //console.log(data);

    //console.log(formData);

    const handleDelete = (id) => {
        if(filteredData.length === 1 && currentPage !== 1){
            setCurrentPage((prev) => prev-1);
        }

        const updatedList = data.filter((item) => item.id !== id);
        setData(updatedList);
    };

    const handleEdit = (id,updatedData) => {
        if(!editId || edit !== id){
            return;
        }
        const updatedList = data.map((item) => {
            if(item.id === id){
                return {...item,...updatedData};
            }
            return item;
        });
        setData(updatedList);
        //console.log(data);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

  return (
    <div className="container">

      <div className="add-container">
        <div className="info-container">
            <input type='text' placeholder="Name" name='name' value={formData.name} onChange={handleInputChange}/>
            <input type='text' placeholder="Gender" name="gender" value={formData.gender} onChange={handleInputChange}/>
            <input type='text' placeholder='Age' name='age' value={formData.age} onChange={handleInputChange}/>
            <button className='add' onClick={handleAddClick}>ADD</button>
        </div>
      </div>

      <div className="search-table-container">
        <input 
           type='text'
           placeholder='Search by Name'
           value={search}
           onChange={handleSearch}
           className='search-input' 
        />
        <table ref={outSideClick}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                { filteredData.map((item) => (
                        <tr key={item.id}>
                           <td id={item.id} contentEditable={editId === item.id} onBlur={(e) => handleEdit(item.id,{name: e.target.innerText})}>{item.name}</td>
                           <td id={item.id} contentEditable={editId === item.id} onBlur={(e) => handleEdit(item.id,{name: e.target.innerText})}>{item.gender}</td>
                           <td id={item.id} contentEditable={editId === item.id} onBlur={(e) => handleEdit(item.id,{name: e.target.innerText})}>{item.age}</td>
                           <td className='actions'>
                              <button className='edit' onClick={() => setEditId(item.id)}>Edit</button>
                              <button className='delete' onClick={() => handleDelete(item.id)}>Delete</button>
                           </td>
                        </tr>
                    ))}
                
            </tbody>
        </table>

        <div className='pagination'>
            {Array.from({length: Math.ceil(filteredItems.length/itemPerPage)},(_,index) => (
                <button key={index + 1} onChange={() => paginate(index+1)}  style={{backgroundColor: currentPage == index+1 && "lightgreen"}}>{index+1}</button>
            ))};
        </div>

      </div>

    </div>
  )
}

export default DataTable;