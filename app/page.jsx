"use client";

import { useState, useEffect } from "react";
import { evaluate, getRubric } from "./actions";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Textarea,
  Button,
  Progress,
} from "@nextui-org/react";
import HtmlDisplayAndDownload from "@/components/html";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default function Home() {
  const [generation, setGeneration] = useState("");
  const [selectedTab, setSelectedTab] = useState("instructions");
  const [generating, setGenerating] = useState(false);
  const [rubric, setRubric] = useState("");
  const [answer, setAnswer] = useState("");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const fetchRubric = async () => {
      try {
        const rubric = await getRubric(); // Fetch rubric from server
        setRubric(rubric);
      } catch (error) {
        console.error("Error fetching rubric:", error);
      }
    };

    fetchRubric();
  }, []);

  return (
    <div>
      <div className="flex w-full flex-col max-w-[600px] mx-auto">
        <Tabs
          aria-label="Options"
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          <Tab key="instructions" title="Rubric">
            <Card className=" h-[300px]">
              <CardBody>
                <Textarea
                  label=""
                  placeholder="Copy and paste the question and the comprehensive marking rubric
                for the essays, along with the marks allocated for each section."
                  className="h-[200px]"
                  minRows={20}
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                />
                <Button
                  color="primary"
                  onClick={() => setSelectedTab("answer")}
                >
                  Go to answer
                </Button>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="answer" title="Answer">
            <Card className=" h-[300px]">
              <CardBody>
                <Textarea
                  label=""
                  placeholder="Copy and paste the student's answer here."
                  className="h-[200px]"
                  minRows={20}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <Button
                  color="primary"
                  onClick={async () => {
                    setSelectedTab("results");
                    setGenerating(true);
                    const { text } = await evaluate(rubric, answer);
                    setGeneration(text);
                    setGenerating(false);
                    setGenerated(true);
                  }}
                >
                  Submit
                </Button>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="results" title="Results">
            <Card className=" h-[300px]">
              <CardBody>
                {generating && (
                  <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className="w-full my-4"
                  />
                )}
                {generated && (
                  <HtmlDisplayAndDownload htmlContent={generation} />
                )}

                {!generated && (
                  <Textarea
                    label=""
                    placeholder="Evaluation results will be displayed here."
                    className="h-[200px]"
                    minRows={20}
                    disabled
                  />
                )}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
