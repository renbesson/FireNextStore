import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Breadcrumb } from 'antd';
import {
	useDocument,
	useCollection,
	revalidateDocument,
	revalidateCollection,
	// these all update BOTH Firestore & the local cache ⚡️
	set, // set a firestore document
	update, // update a firestore document
	fuego, // get the firebase instance used by this lib
} from '@nandorojo/swr-firestore';

export default function ProductPage() {
	const router = useRouter();
	const { pid } = router.query;
	const { product, error } = useDocument(`users/${pid}`);

	if (!product) {
		return 'Loading... ' + pid + error;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div>
			{product.category && (
				<Breadcrumb>
					<Breadcrumb.Item>
						<Link href="/">
							<a>{product.category[0]}</a>
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<Link href="/">
							<a>{product.category[1]}</a>
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<Link href="/">
							<a>{product.category[2]}</a>
						</Link>
					</Breadcrumb.Item>
				</Breadcrumb>
			)}
		</div>
	);
}
