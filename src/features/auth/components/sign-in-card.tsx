import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {FcGoogle} from "react-icons/fc";
import {SignInFlow} from "@/features/auth/types";
import {useState} from "react";
import {useAuthActions} from "@convex-dev/auth/react";
import {TriangleAlert} from "lucide-react";

interface SignInCardProps {
    setState: (state: SignInFlow) => void;
}

export const SignInCard = ({setState}: SignInCardProps) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const { signIn } = useAuthActions();

    const providerSignIn = (value: "google") => {
        setPending(true);
        signIn(value).finally(() => setPending(false));
    }

    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        // form submit causes page refresh prevent it!
        e.preventDefault();
        setPending(true);
        signIn("password", {
            email: email,
            password: password,
            flow: "signIn"
        }).catch(() => {
            setError("Invalid Email or Password")
        }).finally(() => setPending(false));
    }

    return (
        <Card className="h-full w-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                Login To continue
                </CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className={"size-4"}/>
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={onPasswordSignIn}>
                    <Input
                        disabled={pending}
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                        placeholder={"Email"}
                        type={"email"}
                        required={true}
                    />
                    <Input
                        disabled={pending}
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        placeholder={"Password"}
                        type={"password"}
                        required={true}
                    />
                    <Button type={"submit"} className="w-full" size="lg" disabled={pending}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={pending}
                        onClick={() => {providerSignIn("google")}}
                        variant={"outline"}
                        size={"lg"}
                        className={"w-full relative"}
                    >
                        <FcGoogle className="size-5 absolute top-3 left-2.5"/>
                        Continue with Google
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Don&apos;t have an account? <span
                    className="text-sky-700 hover:underline cursor-pointer"
                    onClick={() => {
                        setState("signUp");
                    }}
                >
                    Sing up
                </span>
                </p>
            </CardContent>
        </Card>
    )
}