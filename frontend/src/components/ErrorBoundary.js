import { useRouteError } from "react-router";

function ErrorBoundary(){
    const { data,status, statusText }=useRouteError();
    return(
        <div>
        <p>{data}</p>
        <p>
        {status}-{statusText}
        </p>
        </div>
    );
}
export default ErrorBoundary;
