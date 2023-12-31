import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { Suspense } from "react";
import SadFace from "@/components/icons/SadFace";
import CreateCollectionBtn from "./_components/CreateCollectionBtn";
import CollectionCard from "./_components/CollectionCard";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMessage />
      </Suspense>
      <Suspense fallback={<CollectionWaitFallback />}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomeMessage() {
  const user = await currentUser();

  if (!user) {
    return <div>error</div>;
  }

  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        Welcome
        <br />
        {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        <Skeleton className="w-[180px] h-[36px] mb-10 " />
        <Skeleton className="w-[150px] h-[36px]" />
      </h1>
    </div>
  );
}

function CollectionWaitFallback() {
  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        <Skeleton className="w-[500px] h-[100px] mb-10" />
        <Skeleton className="w-[600px] h-[100px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });

  if (collections.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Alert>
          <SadFace />
          <AlertTitle>There are no collections yet!</AlertTitle>
          <AlertDescription>
            Create a collection to get started
          </AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionBtn />
      <div className="flex flex-col gap-4 mt-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
