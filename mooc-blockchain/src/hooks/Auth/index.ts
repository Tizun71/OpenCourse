import AuthContext from "@/context/Auth";
import { useContext } from "react";

export function useAuth () {
    const context = useContext(AuthContext);
    if (!context){
        throw new Error("useAuth must be within an AuthProvdier")
    }
    return context;
}
