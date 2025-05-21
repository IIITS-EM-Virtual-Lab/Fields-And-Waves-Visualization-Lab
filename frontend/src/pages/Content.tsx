import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { topicData } from "@/data/db";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

const Content = () => {
  const { id } = useParams();

  const topic = id
    ? topicData.filter((topic) => topic.id === parseInt(id))[0]
    : { title: "", image: "", description: "", subTopics: [], slug: "" };

  return (
    <div className="flex mx-12 py-20 min-h-[90vh]">
      <div className="w-1/3">
        <Card>
          <CardHeader>
            <img src={topic.image} height={100} width={100} />
            <CardTitle className="text-3xl py-4 ">
              {id ? topic.title : "Topic Name"}
            </CardTitle>
            <CardDescription>{topic.description}</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="2/3 mx-24">
        <div className="flex gap-10 text-2xl font-semibold items-center">
          <div className="py-8  px-10 text-4xl rounded-lg bg-slate-300">1</div>
          <div>List of Topics</div>
        </div>
        <div className="py-12">
          {topic.subTopics?.map((subtopic) => {
            return (
              <Link to={subtopic.link}>
                <div className="flex gap-10 text-xl font-semibold items-center px-24 py-4 hover:bg-slate-200 rounded-lg transistion-all duration-150">
                  <div>
                    <img src="/assets/play.png" />
                  </div>
                  <div>{subtopic.name}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Content;
