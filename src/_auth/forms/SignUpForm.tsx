import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {useToast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

import {Input} from "@/components/ui/input";

import {Button} from '@/components/ui/button';
import {useForm} from "react-hook-form";
import {SignUpValidation} from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import {Link, useNavigate} from "react-router-dom";
import {useCreateUserAccountMutation, useSignInAccountMutation} from "@/lib/react-querry/querriesAndMutations";
import {useUserContext} from "@/context/AuthContext";


const SignUpForm = () => {
    const {toast} = useToast();
    const navigate = useNavigate();

    const {checkAuthUser, isLoading: isUserLoading} = useUserContext();


    // 1. Defining the form
    const form = useForm<z.infer<typeof SignUpValidation>>({
        resolver: zodResolver(SignUpValidation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
    });

    // Queries
    // mutateAsync: createUserAccount -> this syntax simply renames the mutateAsync function into createUserAccount
    const {mutateAsync: createUserAccount, isLoading: isCreatingAccount} = useCreateUserAccountMutation();

    const {mutateAsync: signInAccount, isLoading: isSigningInUser} = useSignInAccountMutation();

    // 2. Defining submit handler
    const handleSignup = async (values: z.infer<typeof SignUpValidation>) => {
        try {
            const newUser = await createUserAccount(values);

            if (!newUser) {
                toast({title: 'Sign up failed. Please try again.'})
            }

            const session = await signInAccount({
                email: values.email, password: values.password
            });

            if (!session) {
                toast({title: "Sign in failed. Please try again(session step)"})
            }

            const isLoggedIn = await checkAuthUser();

            if (isLoggedIn) {
                form.reset();

                navigate('/');
            } else {
                toast({title: 'Signup failed. Please try again.'})
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo"/>
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
                <p className="text-light-3 small-medium md:base-regular">To use SocialClub, please enter your
                    details</p>

                <form onSubmit={form.handleSubmit(handleSignup)} className="flex flex-col gap-5 w-full mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {
                            isCreatingAccount || isSigningInUser || isUserLoading ? (
                                <div className="flex-center gap-2">
                                    <Loader/> Loading...
                                </div>
                            ) : ("Sign up")
                        }
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}

export default SignUpForm;