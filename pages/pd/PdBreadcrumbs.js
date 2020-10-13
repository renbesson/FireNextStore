import { Breadcrumb } from 'antd';
import Link from 'next/link';

export default function Breadcrumbs({ category }) {
	return (
		<>
			{category && (
				<Breadcrumb className={'py-2'}>
					<Breadcrumb.Item>
						<Link href={`/pd/search/${category[0]}?sField=category&oField=price&orderBy=asc`}>
							<a>{category[0]}</a>
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<Link href={`/pd/search/${category[1]}?sField=category&oField=price&orderBy=asc`}>
							<a>{category[1]}</a>
						</Link>
					</Breadcrumb.Item>
					<Breadcrumb.Item>
						<Link href={`/pd/search/${category[2]}?sField=category&oField=price&orderBy=asc`}>
							<a>{category[2]}</a>
						</Link>
					</Breadcrumb.Item>
				</Breadcrumb>
			)}
		</>
	);
}
