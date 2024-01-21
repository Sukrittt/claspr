interface AnnouncementPageProps {
  params: {
    announcementId: string;
  };
}

export default function page({ params }: AnnouncementPageProps) {
  const { announcementId } = params;

  return <div>{announcementId}</div>;
}
