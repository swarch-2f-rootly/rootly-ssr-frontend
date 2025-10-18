"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, MapPin, Users, Calendar } from "lucide-react";

interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  location: string;
  public_repos: number;
  followers: number;
  created_at: string;
}

export const TeamCard: React.FC<{ username: string; delay?: number }> = ({ username, delay = 0 }) => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) throw new Error("GitHub error");
        const data = (await res.json()) as GitHubProfile;
        setProfile(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 min-h-[250px] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-emerald-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-emerald-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-emerald-200 rounded w-1/2 mx-auto"></div>
        </div>
      </motion.div>
    );
  }

  if (error || !profile) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 min-h-[250px] flex items-center justify-center">
        <div className="text-center text-slate-500">
          <Users className="w-12 h-12 mx-auto mb-2" />
          <p>Error al cargar perfil</p>
          <p className="text-sm">@{username}</p>
        </div>
      </motion.div>
    );
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("es-ES", { year: "numeric", month: "long" });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }} whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-center mb-4">
        <motion.img src={profile.avatar_url} alt={profile.name || profile.login} className="w-16 h-16 rounded-full border-3 border-emerald-200 shadow-lg group-hover:border-emerald-400 transition-colors duration-300" whileHover={{ scale: 1.05 }} />
      </div>
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{profile.name || profile.login}</h3>
        <p className="text-slate-500 text-xs">@{profile.login}</p>
      </div>
      {profile.bio && <p className="text-slate-600 text-xs text-center mb-3 line-clamp-2">{profile.bio}</p>}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center">
          <div className="text-sm font-bold text-emerald-600">{profile.public_repos}</div>
          <div className="text-xs text-slate-500">Repos</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-emerald-600">{profile.followers}</div>
          <div className="text-xs text-slate-500">Followers</div>
        </div>
      </div>
      {profile.location && (
        <div className="flex items-center justify-center text-slate-500 text-xs mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span className="truncate">{profile.location}</span>
        </div>
      )}
      <div className="flex items-center justify-center text-slate-500 text-xs mb-3">
        <Calendar className="w-3 h-3 mr-1" />
        <span>Desde {formatDate(profile.created_at)}</span>
      </div>
      <motion.a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg text-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Github className="w-3 h-3 mr-1" /> GitHub <ExternalLink className="w-3 h-3 ml-1" />
      </motion.a>
    </motion.div>
  );
};

export default TeamCard;


