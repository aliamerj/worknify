import { AppRouter } from '@/utils/router/app_router';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import {  FaUserPlus } from 'react-icons/fa';


export const Noprofile = ({isCurrentUser}:{isCurrentUser: boolean}) => {
 const message = isCurrentUser
    ? "You don't have a profile yet. Ready to start building it RIGHT NOW !!"
    : "This user hasn't created a profile yet. Check back soon!";

  const actionButton = isCurrentUser ? (
    <Button as={Link} href={AppRouter.createProfile} color='primary' variant='shadow'>
      Create My Profile
    </Button>
  ) : null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <div className="text-center">
        <div className="mb-4 p-4 bg-blue-100 rounded-full inline-block">
          <FaUserPlus className="text-6xl text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Oops! Profile Not Found.
        </h1>
        <p className="mt-2 text-gray-600 mb-2">{message}</p>
        {actionButton}
      </div>
    </div>
  );
};

