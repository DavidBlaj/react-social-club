import React from 'react';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";

import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters."
    }),
});

// post is 'props'
// we only use post as 'props' if updating the post
const PostForm = () => {
    // 1. Define my form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    });

    // 2. Define a submit handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-9 w-full ">
                <FormField control={form.control}
                           name="caption"
                           render={({field}) => (
                               <FormItem>
                                   <FormLabel className="shad-form_label">Caption</FormLabel>
                                   <FormControl>
                                       <Textarea className="shad-textarea custom-scrollbar" {...field} />
                                   </FormControl>
                                   <FormMessage className="shad-form_message"/>
                               </FormItem>
                           )}
                />
                {/*This is the place for the future FileUploader*/}
                <FormField control={form.control}
                           name="location"
                           render={({field}) => (
                               <FormItem>
                                   <FormLabel className="shad-form_label">Add Location</FormLabel>
                                   <FormControl>
                                       <Input type="text" className="shad-input"/>
                                   </FormControl>
                                   <FormMessage className="shad-form_message"/>
                               </FormItem>
                           )}
                />
                <FormField control={form.control}
                           name="location"
                           render={({field}) => (
                               <FormItem>
                                   <FormLabel className="shad-form_label">Add Location</FormLabel>
                                   <FormControl>
                                       <Input type="text" className="shad-input"/>
                                   </FormControl>
                                   <FormMessage className="shad-form_message"/>
                               </FormItem>
                           )}
                />
                <FormField control={form.control}
                           name="tags"
                           render={({ field }) => (
                               <FormItem>
                                   <FormLabel className="shad-form_label">Add Tags (separated by comma " ,
                                       ")</FormLabel>
                                   <FormControl>
                                       <Input type="text"
                                              className="shad-input"
                                              placeholder="Art, Expression, Sports"
                                       />
                                   </FormControl>
                                   <FormMessage className="shad-form_message"/>
                               </FormItem>
                           )}
                />
                <div className="flex gap-4 items-center justify-end">
                    <Button type="button" className="shad-button_dark_4">Cancel</Button>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>
                </div>
            </form>
        </Form>
    )
}

export default PostForm;
