import { SearchBar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';

import { nanoid } from 'nanoid';
import { fetchImages } from 'services/api';
import { ToastContainer } from 'react-toastify';
import { success, warn, info, empty } from 'services/toasts';
import { GlobalStyle, Layout, } from './GlobalStyle';
import { useState, useEffect } from 'react';

export const App = () => {

  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImg, setTotalImg] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // start var

  // useEffect(() => {
  //   async function getQuizzes() {
  //     const shotQuery = query.slice(9, query.length);
  
  //     try {
  //       setIsLoading(true);
  //       const quizItems = await fetchImages(shotQuery, page);
  //       setImages([quizItems]);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   getQuizzes();
  // }, [query, images, page, totalImg, isLoading]);

  useEffect(() => {
    if (query === '') {
      return;
    }
    const shotQuery = query.slice(9, query.length);
      setIsLoading(true);

      setTimeout(async () => {
          try {
          const { hits, totalHits } = await fetchImages(shotQuery, page);
                  if (totalHits !== 0 && page === 1) {
                    success(totalHits);
                  } else if (totalHits === 0) {
                    empty();
                  }
          
                  setImages(prevState =>
                    [...prevState, ...hits]);
          
                  setTotalImg(totalHits);
          
        } catch (error) {
          console.log(error);
          error();
        } finally {
          setIsLoading(false);
        }
      }, 800);

    }, [query, page]);

    useEffect(() => {
      if (images.length === totalImg && totalImg > 0 && page !== 1) {
        info();
      }
    }, [images.length, page, totalImg]);

const handleSubmit = evt => {
  evt.preventDefault();
    const targetQuery = evt.target.elements.query.value.trim();
  if (targetQuery === '') {
    warn();
    return;
  }
  onChangeQuery(targetQuery);
};

const onChangeQuery = newQuery => {
  setQuery(`${nanoid(8)}/${newQuery}`);
  setImages([]);
  setPage(1);
  setTotalImg(0);
};

const onChangePage = () => {
  setPage(prev => prev + 1);
};

  return (
    <Layout>
      <SearchBar onSubmit={handleSubmit}/>

      <ImageGallery images={images}/>
      {isLoading && <Loader/>}
      {images.length === 0 || images.length === totalImg ? (<Button changePage={onChangePage}/>) : null}
      <ToastContainer/>
      <GlobalStyle/>
    </Layout>
  );
};
