import { Backend_skill, Frontend_skill, Full_stack, Other_skill, Skill_data } from "@/constants";
import SkillDataProvider from "./skills/SkillDataProvider";
import SkillText from "./skills/SkillText";

export default function SkillsShowcase() {
  return (
    <section id="skills-animated" className="flex flex-col items-center justify-center gap-3 relative overflow-hidden py-20">
      <SkillText />
      <div className="flex flex-row justify-around flex-wrap mt-4 gap-5 items-center">
        {Skill_data.map((image, index) => (
          <SkillDataProvider key={`core-${index}`} src={image.Image} width={image.width} height={image.height} index={index} />
        ))}
      </div>
      <div className="flex flex-row justify-around flex-wrap mt-6 gap-5 items-center">
        {Frontend_skill.map((image, index) => (
          <SkillDataProvider key={`fe-${index}`} src={image.Image} width={image.width} height={image.height} index={index} />
        ))}
      </div>
      <div className="flex flex-row justify-around flex-wrap mt-6 gap-5 items-center">
        {Backend_skill.map((image, index) => (
          <SkillDataProvider key={`be-${index}`} src={image.Image} width={image.width} height={image.height} index={index} />
        ))}
      </div>
      <div className="flex flex-row justify-around flex-wrap mt-6 gap-5 items-center">
        {Full_stack.map((image, index) => (
          <SkillDataProvider key={`fs-${index}`} src={image.Image} width={image.width} height={image.height} index={index} />
        ))}
      </div>
      <div className="flex flex-row justify-around flex-wrap mt-6 gap-5 items-center">
        {Other_skill.map((image, index) => (
          <SkillDataProvider key={`ot-${index}`} src={image.Image} width={image.width} height={image.height} index={index} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <div className="absolute -inset-32 bg-[radial-gradient(600px_400px_at_50%_10%,hsl(var(--neon)/.20),transparent_60%)]" />
      </div>
    </section>
  );
}
