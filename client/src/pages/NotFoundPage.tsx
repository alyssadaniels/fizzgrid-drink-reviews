import PageContainer from "../components/common/layouts/PageContainer";

/**
 * Not found page
 * @returns NotFoundPage component
 */
function NotFoundPage() {
  return (
    <>
      <PageContainer>
        <h1 className="text-5xl font-bold">Page Not Found</h1>
        <p className="mt-10 text-lg">
          We couldn't find what you were looking for.
        </p>
      </PageContainer>
    </>
  );
}

export default NotFoundPage;
