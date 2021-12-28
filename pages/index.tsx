import FileExplorer from "./files";
import { getServerSideProps as gsP } from "./files";

export default (props: any) => {
	return (
		<main>
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

export const getServerSideProps = gsP;
