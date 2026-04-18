import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { errorClass, loadingClass } from "../Commonstyles";

function Register() {

  const { register, handleSubmit, formState:{errors} } = useForm();
  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const onSubmit = async (data) => {

    console.log(data);

    setLoading(true);
    setError(null);

    try{

      let {role,...userObj} = data;

      const formData = new FormData();
      formData.append("firstName", userObj.firstName);
      formData.append("lastName", userObj.lastName);
      formData.append("email", userObj.email);
      formData.append("password", userObj.password);
      
      if (userObj.profileImage && userObj.profileImage.length > 0) {
        formData.append("profilePic", userObj.profileImage[0]);
      }

      if(role === "USER"){
        let resObj = await axios.post(
          "http://localhost:4000/user-api/users",
          formData
        );

        console.log(resObj.data);
        if(resObj.status === 201){
            navigate("/login");
        }
      }

      if(role === "AUTHOR"){
        let resObj = await axios.post(
          "http://localhost:4000/author-api/users",
          formData
        );

        console.log(resObj.data);
        if(resObj.status === 201){
            navigate("/login");
        }
      }

    }
    catch(err){
      console.log("error is",err);
      setError(err.response?.data?.message || "Something went wrong");
    }
    finally{
      setLoading(false);
    }
  };
 useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
        }, [preview]);
  //loading
  if(loading==true){
    return <p className={loadingClass}></p>
  }
  if(error){
    return <p className={errorClass}>{error.message}</p>
  }

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">

    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="bg-white w-full max-w-md p-8 rounded-xl shadow-sm border border-gray-200"
    >

      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Register
      </h2>

      {/* ROLE */}
      <div className="mb-4 text-sm text-gray-600">
        <p className="mb-1">Select Role</p>

        <label className="mr-4">
          <input type="radio" value="USER"
            {...register("role",{required:"Role is required"})}/> User
        </label>

        <label>
          <input type="radio" value="AUTHOR"
            {...register("role",{required:"Role is required"})}/> Author
        </label>

        {errors.role && (
          <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* NAME */}
      <div className="flex gap-3">
        <input
          placeholder="First Name"
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          {...register("firstName",{required:"First name is required"})}
        />

        <input
          placeholder="Last Name"
          className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          {...register("lastName",{required:"Last name is required"})}
        />
      </div>

      {/* EMAIL */}
      <input
        placeholder="Email"
        className="w-full border border-gray-300 p-2 mt-3 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
        {...register("email",{
          required:"Email is required",
          pattern:{
            value:/^\S+@\S+\.\S+$/,
            message:"Invalid email format"
          }
        })}
      />
      <p className="text-red-500 text-xs">{errors.email?.message}</p>

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        className="w-full border border-gray-300 p-2 mt-3 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
        {...register("password",{
          required:"Password is required",
          minLength:{
            value:6,
            message:"Min 6 characters"
          }
        })}
      />
      <p className="text-red-500 text-xs">{errors.password?.message}</p>

      {/* IMAGE */}
      <input
        type="file"
        accept="image/png, image/jpeg"
        className="mt-3 text-sm"
        {...register("profileImage")}
        onChange={(e) => {
          const file = e.target.files[0];

          if (file) {
            if (!["image/jpeg", "image/png"].includes(file.type)) {
              setError("Only JPG or PNG allowed");
              return;
            }
            if (file.size > 2 * 1024 * 1024) {
              setError("Max size 2MB");
              return;
            }
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
            setError(null);
          }
        }}
      />

      {preview && (
        <div className="flex justify-center mt-3">
          <img
            src={preview}
            alt="preview"
            className="w-20 h-20 rounded-full object-cover border"
          />
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* BUTTON */}
      <button className="w-full mt-5 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
        {loading ? "Registering..." : "Register"}
      </button>

    </form>
  </div>
);

}

export default Register;