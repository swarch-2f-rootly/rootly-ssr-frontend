import RegisterForm from "@/ui/features/register/RegisterForm";
import Carousel from "@/ui/components/Carousel";

export default function RegisterPage() {
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      {/* Background Carousel */}
      <Carousel />

      {/* Content */}
      <div className="relative z-10">
        <RegisterForm />
      </div>

      {/* Dark overlay to make form stand out */}
      <div className="absolute inset-0 bg-black/30 z-0" />
    </div>
  );
}
