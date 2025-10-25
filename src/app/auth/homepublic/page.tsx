"use client";
import {
  Users,
  MapPin,
  Shield,
  Calendar,
  Star,
  Search,
  Phone,
  Mail,
  Clock,
  TrendingUp,
  Award,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

export default function JobMatchHome() {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Ofertas laborales al instante",
      description:
        "Encuentra oportunidades de trabajo en tiempo real que se adapten a tu perfil profesional y objetivos.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Chatea con tu Match",
      description:
        "Conecta directamente con empleadores interesados en tu perfil para una comunicación más efectiva.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Geolocaliza Trabajos",
      description:
        "Encuentra empleos cerca de tu ubicación o en la zona donde deseas trabajar.",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Ofertas seguras y verificadas",
      description:
        "Todas las ofertas pasan por un proceso de verificación para garantizar su autenticidad.",
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: "Horarios de trabajo flexibles",
      description:
        "Encuentra trabajos con horarios que se adapten a tu estilo de vida y necesidades.",
    },
    {
      icon: <Star className="w-8 h-8 text-blue-600" />,
      title: "Transparente Feedback",
      description:
        "Recibe retroalimentación clara sobre tu proceso de selección y mejora tu perfil.",
    },
  ];

  const news = [
    {
      title: "Nuevas oportunidades en tecnología",
      description:
        "El sector tech sigue creciendo con más de 500 nuevas ofertas esta semana",
      date: "22 Sep 2024",
      category: "Tecnología",
    },
    {
      title: "Tendencias del trabajo remoto",
      description:
        "El 70% de las empresas ofrecen modalidad híbrida o remota completa",
      date: "20 Sep 2024",
      category: "Tendencias",
    },
    {
      title: "JobMatch supera los 10,000 usuarios",
      description:
        "Celebramos este hito con nuevas funcionalidades para mejorar tu experiencia",
      date: "18 Sep 2024",
      category: "Empresa",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Trabaja a tu ritmo,{" "}
                <span className="text-blue-600">gana en tu tiempo</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                JobMatch te conecta con ofertas de trabajo en tiempo real que se
                ajustan a tus habilidades y horarios, transformando la forma en
                que encuentras trabajo.
              </p>
              <Link
                href="/publications/publications_view"
                className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                <span>Explorar trabajos</span>
                <Search className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Briefcase className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">5,000+</div>
                    <div className="text-sm">Empleos</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-sm">Usuarios</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm">Éxito</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">4.8</div>
                    <div className="text-sm">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir JobMatch?
            </h2>
            <p className="text-lg text-gray-600">
              Descubre las ventajas que nos hacen diferentes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-gray-600">
              ¿Tienes preguntas? Estamos aquí para ayudarte
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Correo Electrónico
              </h3>
              <p className="text-gray-600">Jobmatchsupport@gmail.com</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Teléfono
              </h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Horarios de Atención
              </h3>
              <p className="text-gray-600">Lun - Vie: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Estás listo para encontrar tu trabajo ideal?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de profesionales que ya encontraron su empleo perfecto
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Registrarse Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
