import { Title } from "react-admin";

export default function CustomTitle(props) {
  return <Title title={<a href="/">{props.title}</a>} />;
}
