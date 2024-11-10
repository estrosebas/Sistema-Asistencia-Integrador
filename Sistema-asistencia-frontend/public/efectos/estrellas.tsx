// Estrellas.tsx
import React, { useEffect } from 'react';
import './estrellas.css';

const Estrellas: React.FC = () => {
  useEffect(() => {
    const contenedorEstrellas = document.querySelector('.estrellas');
    const cantidadEstrellas = 100;

    if (contenedorEstrellas) {
      for (let i = 0; i < cantidadEstrellas; i++) {
        const estrella = document.createElement('div');
        estrella.classList.add('estrella');
        estrella.style.left = `${Math.random() * 100}vw`;
        estrella.style.top = `${Math.random() * 100}vh`;
        estrella.style.animationDuration = `${Math.random() * 5 + 5}s`;
        estrella.style.animationDelay = `${Math.random() * 10}s`;
        contenedorEstrellas.appendChild(estrella);
      }
    }

    return () => {
      if (contenedorEstrellas) {
        contenedorEstrellas.innerHTML = ''; // Limpiar estrellas cuando el componente se desmonte
      }
    };
  }, []);

  return <div className="estrellas"></div>;
};

export default Estrellas;
