import { AppRouterContextProviderMock } from "@/__test__/app-router-context-provider-mock";
import { ProfileForm } from "@/app/(main)/profile/_components/_create_section/_form/profile_form";
import { ProfileData, ProfileDataProvider, useProfileData } from "../../../app/(main)/profile/_components/context/profile_context";
import { AllProfileData } from "@/utils/api_handler/profile_handler";
import { profileSchemaValidation } from "@/utils/validations/profileValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { act, fireEvent, render,getByLabelText } from "@testing-library/react";
import axios from "axios";
import React from "react";


beforeEach(() => {
    jest.resetAllMocks();
  });
  

    // The onSubmit function should be called when the form is submitted with valid data
    it('should call onSubmit function and update profile data when form is submitted with valid data',async () => {
        // Mock dependencies
        const push = jest.fn();
        const refresh = jest.fn();
        const mockAxiosPost = jest.spyOn(axios, 'post');

        const mockUseForm = jest.fn(() => ({
          control: {},
          handleSubmit: jest.fn((callback) => callback({})),
          watch: jest.fn(),
        }));
        const mockUseFieldArray = jest.fn(() => ({
          fields: [],
          append: jest.fn(),
          remove: jest.fn(),
        }));
        const mockUseEffect = jest.spyOn(React, 'useEffect');
        const mockSetMessage = jest.fn();
        const mockSetIsLoading = jest.fn();
        const mockZodResolver = jest.fn();
   
  
        // Mock context values
        const profileData = {
            jobTitle: 'Software Engineer',
            fullName: 'John Doe',
            address: 'USA, New York',
            email: 'johndoe@example.com',
            phoneNumber: '1234567890',
            background: 'I am a software engineer with 5 years of experience',
            skills: 'React, Node.js',
            github: "aliamerj",
            userId:"xxx",
            experiences: [
                {
                    role: 'Software Engineer',
                    company: 'ABC Inc.',
                    timePeriod: {
                        startDate: new Date().toISOString(),
                        endDate: null,
                    },
                },
            ],
            educations: [
                {
                    degree: 'Bachelor of Science in Computer Science',
                    school: 'XYZ University',
                    timePeriod: {
                        startDate: new Date().toISOString(),
                        endDate: null,
                    },
                },
            ],
            sections: [
                {
                    title: 'Projects',
                    description: 'Some projects I have worked on',
                },
            ],
        };

        const profileDataMock = {
            id: 1,
            fullName: profileData.fullName,
            jobTitle:profileData.jobTitle,
            background: profileData.background,
            phoneNumber: profileData.phoneNumber,
            address:profileData.address,
            email:profileData.email,
            github:profileData.github,
            linkedin: profileData.github,
            skills: profileData.skills,
            userId: profileData.userId
            
        };
        const mockProfileData = {
            profileData: profileData,
       
          };
      
          const formRefMock: React.RefObject<HTMLButtonElement> = {
            current: {
              click: jest.fn(),
            } as unknown as HTMLButtonElement,
          };
        // Mock useForm hook
        jest.mock('../../../app/(main)/profile/_components/context/profile_context', () => ({
            useProfileData: jest.fn().mockReturnValue({
                profileData: {...profileData,edit:false},
                updateProfileData: jest.fn(),
                setIsLoading: jest.fn(),
                formRef: formRefMock, // Mock ref if needed
                profileId: 123,
                findDifferences: jest.fn(),
                isLoading: false,
                triggerSubmit:jest.fn(),
                resetForm:jest.fn()
            }),
          }));
              // Mock dependencies
      jest.mock('axios');
      jest.mock('react-hook-form', () => ({
        useForm: mockUseForm,
        useFieldArray: mockUseFieldArray,
        Controller: jest.fn(),
        SubmitHandler: jest.fn(),
      }));
  
      jest.mock('react', () => ({
        ...jest.requireActual('react'),
        useState: jest.fn(),
        useEffect: mockUseEffect,
        useContext: jest.fn(),
      }));
      jest.mock('@hookform/resolvers/zod', () => ({
        zodResolver: mockZodResolver,
      }));

    
  
        // Mock useProfileData hook
        const mockData:AllProfileData = {
            profile:profileDataMock,
            educations:[],
            experiences:[],
            sections:[]
        }
     
  
        // Render the component
        render(<AppRouterContextProviderMock router={{ push,refresh }}><ProfileDataProvider      
        userId={"xxx"}
        name={"Ali"}
        email={"aliamer@gmail.com"}
        allProfileData={mockData}><ProfileForm /></ProfileDataProvider></AppRouterContextProviderMock>);
  


      
          
        // Assert initial state
       const res =  profileSchemaValidation.safeParse(profileData)
       expect(res.success).toBeTruthy()
       expect(mockUseEffect).toHaveBeenCalled();
       expect(push).not.toHaveBeenCalled();
       expect(refresh).not.toHaveBeenCalled();
       expect(mockAxiosPost).not.toHaveBeenCalled();
      });