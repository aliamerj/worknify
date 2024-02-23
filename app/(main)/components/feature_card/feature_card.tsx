import { IconType } from 'react-icons';

interface FeatureCardProps {
  Icon: IconType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description }) => {
  return (
 <div className="bg-white rounded-lg shadow-md hover:shadow-lg duration-300 ease-in-out overflow-hidden hover:scale-105 transform transition-all hover:cursor-default">
      <div className="p-6 flex flex-col items-center">
        <Icon className="text-primary mb-4 text-3xl" />
        <h5 className="text-lg font-bold mb-2">{title}</h5>
        <p className="text-gray-600 text-sm text-center">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
