interface ClassPageProps {
  params: {
    classId: string;
  };
}

export default async function page({ params }: ClassPageProps) {
  const { classId } = params;

  return <div>{classId}</div>;
}
