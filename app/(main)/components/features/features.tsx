
import FeatureCard from "../feature_card/feature_card"
import { FaPaintBrush, FaProjectDiagram, FaTasks, FaUsers } from "react-icons/fa"


export const Features = () => {
  return (<section className="flex flex-col items-center justify-center pb-3">

      <h1 id="features" className="text-3xl text-gray-800 font-bold leading-snug mb-5 pt-20 text-center">
        <strong>Transform Your Workflow:</strong> Discover the Power of Seamless Collaboration and Project Management
      </h1>
  <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-2">
          <FeatureCard
            Icon={FaPaintBrush}
            title="Personalized Portfolio Creation"
            description="Craft Your Professional Identity: Build a stunning online portfolio effortlessly. Highlight your skills, projects, and achievements with our intuitive profile builder. Make your first impression count."
          />
          <FeatureCard
            Icon={FaProjectDiagram}
            title="Dynamic Project Management"
            description="Elevate Your Projects: From conception to completion, manage every aspect of your projects. Set goals, timelines, and technology stacks. Navigate the journey of your projects with clarity and precision."
          />
          <FeatureCard
            Icon={FaTasks}
            title="Customizable Task Dashboards"
            description="Master Task Organization: Dive into efficient task management with customizable dashboards. Create, assign, and track tasks with ease. Move projects forward with our dynamic Kanban boards."
          />
          <FeatureCard
            Icon={FaUsers}
            title="Flexible Collaboration Options"
            description="Collaborate Your Way: Choose who sees and joins your projects with flexible permission settings. Engage with a community of professionals or keep your collaborations private. Empowerment is at your fingertips."
          /> 
        </div>
      </div>
    </section>

  )
}
