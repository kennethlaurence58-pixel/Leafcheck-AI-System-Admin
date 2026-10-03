import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

type ProfileValue = {
  name: string;
  email: string;
  photoUri?: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhotoUri: (value?: string) => void;
};

const ProfileContext = createContext<ProfileValue | null>(null);

export function ProfileProvider({ children }: PropsWithChildren) {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@leafcheck.app");
  const [photoUri, setPhotoUri] = useState<string>();
  const value = useMemo(() => ({ name, email, photoUri, setName, setEmail, setPhotoUri }), [name, email, photoUri]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error("useProfile must be used inside ProfileProvider");
  return value;
}
