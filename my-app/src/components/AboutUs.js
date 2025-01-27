import React from 'react';
import {
  CCard,
  CCardBody,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
} from '@coreui/react';


export const AboutUs = () => {
  const cardData = [
    {
      title: 'Ayush Kumar Chouksey',
      subtitle: 'Project Lead',
      text: 'React And Backend',
      links: ['https://www.instagram.com/ayush__.31/'],
    },
    {
      title: 'Harsh Ahelleya',
      subtitle: '',
      text: 'React,UI/UX And Management',
      links: ['#link3'],
    },
    {
      title: 'Harsh Agnihotri',
      subtitle: 'PR head',
      text: 'Management And PR',
      links: ['#link5'],
    },
    {
      title: 'Divyam Pandey',
      subtitle: '',
      text: 'UI/UX And Frontend',
      links: ['#link7'],
    },
    {
      title: 'Isha Rajput',
      subtitle: '',
      text: 'Backend',
      links: ['#link9'],
    },
    {
      title: 'Jagriti Chaudhary',
      subtitle: '',
      text: 'React',
      links: ['#link11'],
    },
    {
      title: 'Harshita Shukla',
      subtitle: '',
      text: 'Frontend',
      links: ['#link13'],
    },
   
  ];

  return (
    <div className="card-container">
      {cardData.map((card, index) => (
        <CCard key={index} className="custom-card">
          <CCardBody>
            <CCardTitle className="custom-title">{card.title}</CCardTitle>
            <CCardSubtitle className="custom-subtitle">{card.subtitle}</CCardSubtitle>
            <CCardText className="custom-text">{card.text}</CCardText>
            {card.links.map((link, idx) => (
              <CCardLink key={idx} href={link} className="custom-link">
                Contact
              </CCardLink>
            ))}
          </CCardBody>
        </CCard>
      ))}
    </div>
  );
};
