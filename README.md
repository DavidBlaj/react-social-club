# React + TypeScript + Vite

3.0

I want to add the user in a session when creating the user. For this, apparently i have to use TanStack Querry(ReactQuerry)
What ReactQuerry does is it helps me for example to "Cache the data i am fetching from the server", "Auto refetching", "Infinite Scroll" etc

I install it using: npm install @tanstack/react-querry
at first i add a react-querry folder in the lib folder.
    - here i create querriesAndMutations

Look at the createUserAccount method call in SignUpForm.tsx, it's basically not going to communicate directly to appwrite,
but through reactQuerry. Notice how createUserAccount is in fact the mutateAsync function of useCreateUserAccountMutation().
So, basically, the mutation is calling createUserAccount from Appwrite for me.
It is a level in between my Frontend and Appwrite, to ensure:
    - easier fetching data on React
    - queering and mutating the data
    - cashing the data

As a general concept, what i do here is taking the method from api.ts and transfroming it into a mutation or a querry method.

After i have the session(SignUpForm.tsx), i have to store it in my 'react context'. At all times i need to know that i have
a logged in user.

I start by creating a folder named 'context' under src.
then i create 'AuthContext' file.

Here i have to create an initial user and state objects.
then i use state for user, isLoading and isAuthenticated.
I check if the user is authenticated with checkAuthUser().

With useEffect i check every time i reload if i am signed in or not.

trebe sa creez provider si pentru query nu numai pentru context.


In main.tsx trebuie sa pun app in context-ul <AuthProvider>

Adaug QueryProvider.tsx. QueryClient il folosesc pentru a interactiona cu un cache.
are printre altele si metoda useQueryClient, regasita si in fisierul querriesAndMutations.ts, metoda 
pe care inca eu nu o folosesc

!Error
isCreatingAccount is not defined
este vorba despre isLoading din useCreatUserAccountMutation
Pare sa fie ceva problema cu versiunea tanstack.
In final este vorba de faptul ca trebuie sa schimb isLoading -> isPending


3.1 Fixed imageUrl missing attribute error
- it was just a small typo in the name imageUrl... mind those small typos, it can save you like two days

4. Added the Sign in option
    - added a new validation type in zod index file
    - created the SignInForm.tsx

5 - We go on with building our app first by designing our Homepage(under _root/pages).
    - we add at first a TopBar, a LeftSidebar, and a bottomSideBar component(inside components' folder)
      and render them inside RootLayout.
    - we also added an <Outlet /> inside the RootLayout. To see how that works check the documentation or AuthLayout.
    - I then start designing the Topbar
        - here I have to design and implement the signOut button. At first, I have to create a method inside
          queriesAndMutations called useSignOutAccount. In here I call a method that I am going to create right now called
          signOutAccount that it's coming from appwrite(api.ts)
        - then in the Topbar I have to define this newly created mutation
    - inside LeftSidebar instead or manually introducing multiple links(below the profile link),
      I create the constants folder...
    - I will also use the useLocation hook to find on which route I am currently