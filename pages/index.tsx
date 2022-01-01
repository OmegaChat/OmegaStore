import FileExplorer, { props } from "./files";
import { getServerSideProps as gsP } from "./files";

const home = (props: props) => {
	return (
		<main>
			<title>OmegaStore</title>
			<link rel="icon"  href="favicon.ico" />
			<div className="header">
				<div className="header__logo">
					<div className="logo__top">Omega</div>
					<div className="logo__bottom">Store</div>
				</div>
				<div className="header__get">
					<a href="https://github.com/OmegaChat/OmegaStore">
						<button className="get__title">Get OmegaStore</button>
					</a>
				</div>
			</div>
			<FileExplorer rootFiles={props.rootFiles} />
		</main>
	);
};

export default home;

export const getServerSideProps = gsP;
