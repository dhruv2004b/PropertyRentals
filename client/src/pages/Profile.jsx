import { useSelector,useDispatch } from "react-redux";
import { useRef, useState,useEffect } from "react";
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "../redux/user/userSlice";
import {Link} from "react-router-dom";
import {getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase'


export default function Profile() {
  
  const { currentUser ,loading,error} = useSelector((state) => state.user);
  const fileRef= useRef(null);
  const [formData, setFormData] = useState({});
  const dispatch= useDispatch();
  const [updateSuccess,setUpdateSuccess]= useState(false);
  const [file,setFile]= useState(undefined);
  const [filePerc,setFilePerc]= useState(0);
  console.log(filePerc);
  console.log(file);

  // useEffect(()=>{
  //   if(file){
  //     handleFileUpload(file);

  //   }
  // },[file]);

  // const handleFileUpload=(file)=>{
  //   const storage= getStorage(app);
  //   const fileName=new Date().getTime() + file.name;
  //   const storageRef =ref(storage,fileName);
  //   const uploadTask= uploadBytesResumable(storageRef,file);

  //   uploadTask.on('state_changed',
  //     (snapshot)=>{
  //       const progress = (snapshot.bytesTransferred/
  //         snapshot.totalBytes) * 100;
  //         setFilePerc(Math.round(progress));
        
  //     },
  //   )


  // }

  // console.log(formData);
// firebase Storage
// allow read;
// allow write: if
//       request.resource.size < 2* 1024 * 1024 &&
//       request.resource.contentType.matches('image/.*')
  const handleChange=(e)=>{
    setFormData({ ...formData, [e.target.id] : e.target.value });

  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(data.success === false)
        {
          dispatch(updateUserFailure(data.message));
          return;

        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);

    }catch(error)
    {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser= async()=>{
    try{
      dispatch(deleteUserStart())
      const res= await fetch(`/api/user/delete/${currentUser._id}`,{
          method:'DELETE',
          credentials: 'include',
        }
      );
      const data=await res.json();
      if(data.success===false)
      {
        dispatch(deleteUserFailure(data.message));
        return
      }
      dispatch(deleteUserSuccess(data));

    }catch(error)
    {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut= async ()=>{
    try{
      dispatch(signOutUserStart());
      const res = await fetch(`http://localhost:3000/api/auth/signout`, {
        method: "GET",
        credentials: "include", // Ensure cookies are included
      });
      const data= await res.json();
      if(data.success==false)
      {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      
    }catch(error)
    {
      dispatch(signOutUserFailure(error.message));

    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=>fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover hover:cursor-pointer self-center mt-2"
          src={currentUser.avatar}
          alt="profile"
        />

        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading?'WORKING ON IT... ': 'UPDATE'}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={'/create-listing'}>Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5" >{error?error :' '}</p>
      <p className="text-green-700 mt-5" >{updateSuccess?'User is Updated Successfully' :' '}</p>
    </div>
  );
}
