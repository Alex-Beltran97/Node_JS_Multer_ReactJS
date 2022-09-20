import { useEffect, useState } from 'react';
import axios from "axios";
import {Formik,Form,ErrorMessage} from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';

const App = () => {
  const [imageList, setImageList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const closeModal = ()=>setOpen(false);

  const getImages = async ()=>{
    Modal.setAppElement("body");
    const result = await axios.get('http://localhost:3005/images/get');
    setImageList([...result.data]);
  };

  const modalHandler = (image) => {
    setOpen(true);
    setCurrentImage(image);
  };
   
  useEffect(() => {
    getImages();
  }, []);
  return (<>
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <a href="#!" className="navbar-brand">Image App</a>
      </div>
    </nav>
    <div className="container mt-5">
      <Formik
        initialValues={{
          file:null
        }}

        validationSchema={Yup.object().shape({
          file:Yup.mixed().required("Field is required!")
        })}

        onSubmit={async (values)=>{
          const formData = new FormData();
          formData.append("file",values.file);
          try{
            const res = await axios.post(
              "http://localhost:3005/images/post",
              formData
            );
            getImages();
          }catch(error){
            console.log(error);
          };
        }}
      >
        {({setFieldValue})=>(
          <Form className='card p-3'>
            <div className="row">
              <div className="col-10">
                <input 
                  onChange={e=>{
                    setFieldValue('file',e.currentTarget.files[0]);
                  }}
                  className='form-control'
                  type="file"
                  name='file' 
                />
                <ErrorMessage name='file' render={msg=>(<p className='text-danger'>{msg}</p>)}/>
              </div>
              <div className="col-2">
                <button className='btn btn-primary col-12' type="submit">Upload</button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>

    <div className="container mt-3">
      <div className="row">
        {imageList.map((item,index)=>(
          <div className='col-sm-6 col-md-4' key={index}>
            <div className="card p-2 m-2">
              <figure className="card-img-top mx-auto">
                <img src={`http://localhost:3005/${item.id}library.png`} alt="" style={{height:'200px',width:"100%",objectFit:'contain'}}/>
                <div className="card-body">
                  <button className='btn btn-dark' onClick={()=>modalHandler(item.id)}>Click to view</button>
                </div>
              </figure>
            </div>
          </div>
        ))}
      </div>
    </div>

    <ModalImg open={open} closeModal={closeModal} image={currentImage} setImageList={setImageList} imageList={imageList} />
  </>);
};
 
const ModalImg = ({open,closeModal,image,setImageList,imageList})=>{
  const deleteHandler = async (id)=>{
    try{
      const result = await axios.delete(
        `http://localhost:3005/images/delete/${id}`
      );
      setImageList([...imageList.filter(item=>item.id!==id)]);
      console.log(result);
      closeModal();
    }catch(error){
      console.log(error);
    }
  };
  return (<>
    <Modal 
      isOpen={open}
      onRequestClose={closeModal}
      style={{content:{
        left:'20%',
        right:'20%',
        bottom:"10%"
      }}}
    >
      <div className='card'>
        <img src={`http://localhost:3005/${image}library.png`} alt="..." />
        <button className='btn btn-danger' onClick={()=>deleteHandler(image)}>Delete</button>
      </div>
    </Modal>
  </>);
}

export default App;